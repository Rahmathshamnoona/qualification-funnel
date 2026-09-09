import { createClient, type Client } from '@libsql/client'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

if (!process.env.VERCEL && existsSync('.env')) {
  process.loadEnvFile('.env')
}

let client: Client | null = null
let ready: Promise<void> | null = null

function dbUrl(): string {
  if (process.env.LIBSQL_URL) return process.env.LIBSQL_URL
  if (process.env.VERCEL) return 'file:/tmp/funnel.db'
  const file = resolve(process.cwd(), 'data/funnel.db').replace(/\\/g, '/')
  mkdirSync(dirname(file), { recursive: true })
  return `file:${file}`
}

export function getDb(): Client {
  if (!client) {
    const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN
    client = createClient({
      url: dbUrl(),
      ...(authToken ? { authToken } : {}),
    })
  }
  return client
}

export async function ensureSchema(): Promise<void> {
  ready ??= migrate()
  await ready
}

async function migrate(): Promise<void> {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      first_name TEXT,
      last_name TEXT,
      zip TEXT,
      gender TEXT,
      age_range TEXT,
      answers_json TEXT NOT NULL DEFAULT '{}',
      tracking_json TEXT NOT NULL DEFAULT '{}',
      consent_json TEXT NOT NULL DEFAULT '{}',
      fbp TEXT,
      fbc TEXT,
      external_id TEXT,
      lead_grade TEXT,
      qualified INTEGER NOT NULL DEFAULT 1,
      disqualify_reason TEXT,
      restricted_state INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'received',
      match_quality REAL,
      ip TEXT,
      user_agent TEXT,
      event_id_pageview TEXT,
      event_id_lead TEXT,
      event_id_complete TEXT
    );

    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      next_retry_at TEXT,
      sent_at TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(channel, event_id)
    );

    CREATE TABLE IF NOT EXISTS event_log (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      event_name TEXT NOT NULL,
      event_id TEXT NOT NULL,
      source TEXT NOT NULL,
      detail_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status, next_retry_at);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
  `)
}

export type LeadRow = {
  id: string
  created_at: string
  updated_at: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  zip: string | null
  gender: string | null
  age_range: string | null
  answers_json: string
  tracking_json: string
  consent_json: string
  fbp: string | null
  fbc: string | null
  external_id: string | null
  lead_grade: string | null
  qualified: number
  disqualify_reason: string | null
  restricted_state: number
  status: string
  match_quality: number | null
  ip: string | null
  user_agent: string | null
  event_id_pageview: string | null
  event_id_lead: string | null
  event_id_complete: string | null
}

export type OutboxRow = {
  id: string
  lead_id: string
  channel: string
  event_name: string
  event_id: string
  payload_json: string
  status: string
  attempts: number
  last_error: string | null
  next_retry_at: string | null
  sent_at: string | null
  created_at: string
}
