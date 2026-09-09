import express from 'express'
import { ensureSchema } from './db'
import { handleLead } from './lead'
import { handleOps } from './ops'
import { processOutbox } from './outbox'

const app = express()
app.use(express.json({ limit: '1mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-ops-key')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  next()
})

function headers(req: express.Request): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(req.headers)) {
    out[key] = Array.isArray(value) ? value[0] : value
  }
  return out
}

app.get('/api/health', async (_req, res) => {
  await ensureSchema()
  res.json({ ok: true, ts: new Date().toISOString() })
})

app.post('/api/lead', async (req, res) => {
  await ensureSchema()
  const result = await handleLead({
    method: req.method,
    body: req.body,
    headers: headers(req),
    ip: req.ip,
  })
  res.status(result.status).json(result.body)
})

app.get('/api/ops', async (req, res) => {
  await ensureSchema()
  const result = await handleOps(new URLSearchParams(req.query as Record<string, string>))
  res.status(result.status).json(result.body)
})

app.post('/api/ops', async (req, res) => {
  await ensureSchema()
  const result = await handleOps(new URLSearchParams(req.query as Record<string, string>), req.body)
  res.status(result.status).json(result.body)
})

app.post('/api/retry', async (req, res) => {
  await ensureSchema()
  const result = await handleOps(new URLSearchParams(req.query as Record<string, string>), {
    action: 'retry',
    id: req.body?.id,
    key: req.body?.key,
  })
  res.status(result.status).json(result.body)
})

const port = Number(process.env.PORT || 8787)

ensureSchema()
  .then(async () => {
    await processOutbox(10)
    app.listen(port, () => {
      console.log(`API listening on http://127.0.0.1:${port}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
