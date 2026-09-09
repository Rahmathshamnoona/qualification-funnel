import { ensureSchema } from '../server/db'
import { handleLead } from '../server/lead'

function readHeaders(req: { headers?: Record<string, unknown> }): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(req.headers ?? {})) {
    out[key] = Array.isArray(value) ? String(value[0]) : value == null ? undefined : String(value)
  }
  return out
}

export default async function handler(req: { method?: string; body?: unknown; headers?: Record<string, unknown> }, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  await ensureSchema()
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' })
    return
  }
  const result = await handleLead({
    method: req.method,
    body: req.body,
    headers: readHeaders(req),
    ip: readHeaders(req)['x-forwarded-for'],
  })
  res.status(result.status).json(result.body)
}
