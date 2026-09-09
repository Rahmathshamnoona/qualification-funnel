import { getDb } from './db'
import { sendMetaEvent, type MetaEventInput } from './capi'
import { routeLead, type AutomationPayload } from './n8n'

const MAX_ATTEMPTS = 8

function backoffSeconds(attempts: number): number {
  return Math.min(3600, 15 * 2 ** Math.max(0, attempts - 1))
}

export async function enqueueOutbox(input: {
  leadId: string
  channel: 'meta' | 'n8n'
  eventName: string
  eventId: string
  payload: unknown
}): Promise<{ id: string; duplicate: boolean }> {
  const db = getDb()
  const existing = await db.execute({
    sql: 'SELECT id FROM outbox WHERE channel = ? AND event_id = ? LIMIT 1',
    args: [input.channel, input.eventId],
  })
  if (existing.rows[0]) {
    return { id: String(existing.rows[0].id), duplicate: true }
  }

  const id = crypto.randomUUID()
  await db.execute({
    sql: `INSERT INTO outbox (
      id, lead_id, channel, event_name, event_id, payload_json, status, attempts, next_retry_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)`,
    args: [
      id,
      input.leadId,
      input.channel,
      input.eventName,
      input.eventId,
      JSON.stringify(input.payload),
      new Date().toISOString(),
      new Date().toISOString(),
    ],
  })
  return { id, duplicate: false }
}

export async function processOutbox(limit = 20): Promise<{ processed: number; sent: number; failed: number }> {
  const db = getDb()
  const now = new Date().toISOString()
  const due = await db.execute({
    sql: `SELECT * FROM outbox
          WHERE status IN ('pending', 'failed')
            AND (next_retry_at IS NULL OR next_retry_at <= ?)
          ORDER BY created_at ASC
          LIMIT ?`,
    args: [now, limit],
  })

  let sent = 0
  let failed = 0

  for (const row of due.rows) {
    const id = String(row.id)
    await db.execute({
      sql: "UPDATE outbox SET status = 'processing' WHERE id = ? AND status IN ('pending', 'failed')",
      args: [id],
    })

    try {
      const payload = JSON.parse(String(row.payload_json))
      if (row.channel === 'meta') {
        await sendMetaEvent(payload as MetaEventInput)
      } else {
        await routeLead(payload as AutomationPayload)
      }
      await db.execute({
        sql: "UPDATE outbox SET status = 'sent', sent_at = ?, last_error = NULL, attempts = attempts + 1 WHERE id = ?",
        args: [new Date().toISOString(), id],
      })
      sent += 1
    } catch (error) {
      const attempts = Number(row.attempts) + 1
      const message = error instanceof Error ? error.message : String(error)
      const dead = attempts >= MAX_ATTEMPTS
      const next = new Date(Date.now() + backoffSeconds(attempts) * 1000).toISOString()
      await db.execute({
        sql: `UPDATE outbox
              SET status = ?, last_error = ?, attempts = ?, next_retry_at = ?
              WHERE id = ?`,
        args: [dead ? 'dead' : 'failed', message.slice(0, 1000), attempts, next, id],
      })
      failed += 1
    }
  }

  await refreshLeadStatuses()
  return { processed: due.rows.length, sent, failed }
}

async function refreshLeadStatuses(): Promise<void> {
  const db = getDb()
  const leads = await db.execute('SELECT id FROM leads')
  for (const row of leads.rows) {
    const id = String(row.id)
    const jobs = await db.execute({
      sql: 'SELECT channel, status FROM outbox WHERE lead_id = ?',
      args: [id],
    })
    if (!jobs.rows.length) continue
    const hasDead = jobs.rows.some((job) => job.status === 'dead')
    const hasFailed = jobs.rows.some((job) => job.status === 'failed' || job.status === 'pending' || job.status === 'processing')
    const allSent = jobs.rows.every((job) => job.status === 'sent')
    const status = allSent ? 'routed' : hasDead ? 'dead' : hasFailed ? 'degraded' : 'received'
    await db.execute({
      sql: 'UPDATE leads SET status = ?, updated_at = ? WHERE id = ?',
      args: [status, new Date().toISOString(), id],
    })
  }
}

export async function retryOutbox(id?: string): Promise<void> {
  const db = getDb()
  if (id) {
    await db.execute({
      sql: `UPDATE outbox SET status = 'pending', next_retry_at = ? WHERE id = ? AND status IN ('failed', 'dead')`,
      args: [new Date().toISOString(), id],
    })
  } else {
    await db.execute({
      sql: `UPDATE outbox SET status = 'pending', next_retry_at = ? WHERE status IN ('failed', 'dead')`,
      args: [new Date().toISOString()],
    })
  }
  await processOutbox(50)
}

export async function logEvent(input: {
  leadId?: string
  eventName: string
  eventId: string
  source: string
  detail?: unknown
}): Promise<void> {
  const db = getDb()
  await db.execute({
    sql: `INSERT INTO event_log (id, lead_id, event_name, event_id, source, detail_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      crypto.randomUUID(),
      input.leadId ?? null,
      input.eventName,
      input.eventId,
      input.source,
      JSON.stringify(input.detail ?? {}),
      new Date().toISOString(),
    ],
  })
}
