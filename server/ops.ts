import { getDb } from './db'
import { processOutbox, retryOutbox } from './outbox'
import { isMetaConfigured } from './capi'
import { isN8nConfigured } from './n8n'

export async function handleOps(query: URLSearchParams, body?: { action?: string; id?: string }) {
  const key = query.get('key') || (body as { key?: string } | undefined)?.key
  if (!process.env.OPS_KEY || key !== process.env.OPS_KEY) {
    return { status: 401, body: { ok: false, error: 'unauthorized' } }
  }

  if (body?.action === 'retry') {
    await retryOutbox(body.id)
  } else if (body?.action === 'drain') {
    await processOutbox(50)
  }

  const db = getDb()
  const leads = await db.execute('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100')
  const outbox = await db.execute('SELECT * FROM outbox ORDER BY created_at DESC LIMIT 200')
  const events = await db.execute('SELECT * FROM event_log ORDER BY created_at DESC LIMIT 100')

  const counts = await db.execute(`
    SELECT
      (SELECT COUNT(*) FROM leads) AS leads,
      (SELECT COUNT(*) FROM outbox WHERE status = 'sent') AS sent,
      (SELECT COUNT(*) FROM outbox WHERE status = 'failed') AS failed,
      (SELECT COUNT(*) FROM outbox WHERE status = 'dead') AS dead,
      (SELECT COUNT(*) FROM outbox WHERE status = 'pending') AS pending
  `)

  return {
    status: 200,
    body: {
      ok: true,
      config: {
        meta: isMetaConfigured(),
        n8n: isN8nConfigured(),
      },
      counts: counts.rows[0],
      leads: leads.rows,
      outbox: outbox.rows,
      events: events.rows,
    },
  }
}
