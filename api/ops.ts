import { ensureSchema } from '../server/db'
import { handleOps } from '../server/ops'

export default async function handler(
  req: { method?: string; body?: unknown; query?: Record<string, string | string[]>; headers?: Record<string, unknown> },
  res: { status: (code: number) => { json: (body: unknown) => void } },
) {
  await ensureSchema()
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(req.query ?? {})) {
    query.set(key, Array.isArray(value) ? value[0]! : value)
  }
  const headerKey = req.headers?.['x-ops-key']
  if (typeof headerKey === 'string' && !query.get('key')) query.set('key', headerKey)

  const result = await handleOps(query, req.method === 'POST' ? (req.body as { action?: string; id?: string }) : undefined)
  res.status(result.status).json(result.body)
}
