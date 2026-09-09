import { ensureSchema } from '../server/db'

export default async function handler(_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }) {
  await ensureSchema()
  res.status(200).json({ ok: true, ts: new Date().toISOString() })
}
