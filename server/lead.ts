import { z } from 'zod'
import { scoreLead } from '../src/funnel/score'
import { getDb } from './db'
import { hashUserData, estimateMatchQuality, isCaliforniaZip } from './hash'
import { enqueueOutbox, logEvent, processOutbox } from './outbox'
import { isMetaConfigured } from './capi'
import { isN8nConfigured } from './n8n'

const payloadSchema = z.object({
  leadId: z.string().min(8),
  sessionId: z.string().min(8),
  eventId: z.string().min(8),
  eventName: z.enum(['PageView', 'Lead', 'CompleteRegistration']),
  eventSourceUrl: z.string().min(8),
  answers: z.record(z.string(), z.string()).default({}),
  contact: z
    .object({
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      zip: z.string().optional(),
      gender: z.string().optional(),
      ageRange: z.string().optional(),
      over40: z.string().optional(),
    })
    .default({}),
  tracking: z.record(z.string(), z.unknown()).default({}),
  consent: z
    .object({
      tcpa: z.boolean(),
      text: z.string(),
      timestamp: z.string(),
      version: z.string(),
    })
    .optional(),
})

export type IncomingRequest = {
  method?: string
  body: unknown
  headers: Record<string, string | undefined>
  ip?: string
}

function header(headers: Record<string, string | undefined>, name: string): string | undefined {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase())
  return key ? headers[key] : undefined
}

function clientIp(req: IncomingRequest): string | undefined {
  const forwarded = header(req.headers, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim()
  return req.ip
}

export async function handleLead(req: IncomingRequest) {
  const parsed = payloadSchema.safeParse(req.body)
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: parsed.error.flatten() } }
  }

  const data = parsed.data
  const answers = { ...data.answers }
  if (data.contact.over40) answers.over40 = data.contact.over40
  if (data.contact.ageRange) answers.PPR_optin_age = data.contact.ageRange
  if (data.contact.gender) answers.PPR_optin_gender = data.contact.gender

  const qualification = scoreLead(answers)
  const zip = data.contact.zip?.replace(/\D/g, '').slice(0, 5)
  const restrictedState = zip ? isCaliforniaZip(zip) : false
  const ua = header(req.headers, 'user-agent')
  const ip = clientIp(req)
  const tracking = data.tracking as Record<string, string | undefined>

  const user = {
    email: data.contact.email,
    phone: data.contact.phone,
    firstName: data.contact.firstName,
    lastName: data.contact.lastName,
    zip,
    gender: data.contact.gender,
    externalId: data.sessionId,
    fbp: tracking.fbp,
    fbc: tracking.fbc,
    clientIpAddress: ip,
    clientUserAgent: ua,
  }
  const matchQuality = estimateMatchQuality(hashUserData(user))
  const now = new Date().toISOString()
  const db = getDb()

  const existing = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [data.leadId] })
  if (existing.rows[0]) {
    await db.execute({
      sql: `UPDATE leads SET
        updated_at = ?,
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        zip = COALESCE(?, zip),
        gender = COALESCE(?, gender),
        age_range = COALESCE(?, age_range),
        answers_json = ?,
        tracking_json = ?,
        consent_json = COALESCE(?, consent_json),
        fbp = COALESCE(?, fbp),
        fbc = COALESCE(?, fbc),
        external_id = COALESCE(?, external_id),
        lead_grade = ?,
        qualified = ?,
        disqualify_reason = ?,
        restricted_state = ?,
        match_quality = ?,
        ip = COALESCE(?, ip),
        user_agent = COALESCE(?, user_agent),
        event_id_pageview = CASE WHEN ? = 'PageView' THEN ? ELSE event_id_pageview END,
        event_id_lead = CASE WHEN ? = 'Lead' THEN ? ELSE event_id_lead END,
        event_id_complete = CASE WHEN ? = 'CompleteRegistration' THEN ? ELSE event_id_complete END
      WHERE id = ?`,
      args: [
        now,
        data.contact.email ?? null,
        data.contact.phone ?? null,
        data.contact.firstName ?? null,
        data.contact.lastName ?? null,
        zip ?? null,
        data.contact.gender ?? null,
        data.contact.ageRange ?? null,
        JSON.stringify(answers),
        JSON.stringify(data.tracking),
        data.consent ? JSON.stringify(data.consent) : null,
        tracking.fbp ?? null,
        tracking.fbc ?? null,
        data.sessionId,
        qualification.grade,
        qualification.qualified ? 1 : 0,
        qualification.disqualifyReason,
        restrictedState ? 1 : 0,
        matchQuality,
        ip ?? null,
        ua ?? null,
        data.eventName,
        data.eventId,
        data.eventName,
        data.eventId,
        data.eventName,
        data.eventId,
        data.leadId,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO leads (
        id, created_at, updated_at, email, phone, first_name, last_name, zip, gender, age_range,
        answers_json, tracking_json, consent_json, fbp, fbc, external_id, lead_grade, qualified,
        disqualify_reason, restricted_state, status, match_quality, ip, user_agent,
        event_id_pageview, event_id_lead, event_id_complete
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?, ?, ?, ?, ?)`,
      args: [
        data.leadId,
        now,
        now,
        data.contact.email ?? null,
        data.contact.phone ?? null,
        data.contact.firstName ?? null,
        data.contact.lastName ?? null,
        zip ?? null,
        data.contact.gender ?? null,
        data.contact.ageRange ?? null,
        JSON.stringify(answers),
        JSON.stringify(data.tracking),
        JSON.stringify(data.consent ?? {}),
        tracking.fbp ?? null,
        tracking.fbc ?? null,
        data.sessionId,
        qualification.grade,
        qualification.qualified ? 1 : 0,
        qualification.disqualifyReason,
        restrictedState ? 1 : 0,
        matchQuality,
        ip ?? null,
        ua ?? null,
        data.eventName === 'PageView' ? data.eventId : null,
        data.eventName === 'Lead' ? data.eventId : null,
        data.eventName === 'CompleteRegistration' ? data.eventId : null,
      ],
    })
  }

  await logEvent({
    leadId: data.leadId,
    eventName: data.eventName,
    eventId: data.eventId,
    source: 'ingest',
    detail: { matchQuality, grade: qualification.grade },
  })

  const metaPayload = {
    eventName: data.eventName,
    eventId: data.eventId,
    eventSourceUrl: data.eventSourceUrl,
    user,
    customData: {
      content_name: data.eventName,
      content_category: 'disability_qualification',
      status: qualification.qualified ? 'qualified' : 'disqualified',
      lead_grade: qualification.grade,
      value: qualification.estimatedMonthly,
      currency: 'USD',
    },
  }

  const metaJob = await enqueueOutbox({
    leadId: data.leadId,
    channel: 'meta',
    eventName: data.eventName,
    eventId: data.eventId,
    payload: metaPayload,
  })

  let automationJob = { id: '', duplicate: true }
  if (data.eventName !== 'PageView') {
    automationJob = await enqueueOutbox({
      leadId: data.leadId,
      channel: 'n8n',
      eventName: data.eventName,
      eventId: `${data.leadId}:${data.eventName}`,
      payload: {
        leadId: data.leadId,
        eventId: data.eventId,
        eventName: data.eventName,
        email: data.contact.email,
        phone: data.contact.phone,
        firstName: data.contact.firstName,
        lastName: data.contact.lastName,
        zip,
        gender: data.contact.gender,
        ageRange: data.contact.ageRange,
        grade: qualification.grade,
        qualified: qualification.qualified,
        disqualifyReason: qualification.disqualifyReason,
        restrictedState,
        estimatedMonthly: qualification.estimatedMonthly,
        matchQuality,
        answers,
        tracking: data.tracking,
        consent: data.consent,
        createdAt: now,
      },
    })
  }

  const drain = await processOutbox(25)

  return {
    status: 200,
    body: {
      ok: true,
      leadId: data.leadId,
      eventId: data.eventId,
      qualified: qualification.qualified,
      grade: qualification.grade,
      estimatedMonthly: qualification.estimatedMonthly,
      matchQuality,
      meta: {
        queued: !metaJob.duplicate,
        status: isMetaConfigured() ? 'attempted' : 'demo',
        duplicate: metaJob.duplicate,
      },
      automation: {
        queued: !automationJob.duplicate,
        status: isN8nConfigured() ? 'attempted' : 'local_store',
        duplicate: automationJob.duplicate,
      },
      drain,
      demoMode: !isMetaConfigured() || !isN8nConfigured(),
    },
  }
}
