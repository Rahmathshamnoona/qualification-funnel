export type AutomationPayload = {
  leadId: string
  eventId: string
  eventName: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  zip?: string
  gender?: string
  ageRange?: string
  grade: string
  qualified: boolean
  disqualifyReason: string | null
  restrictedState: boolean
  estimatedMonthly: number
  matchQuality: number
  answers: Record<string, string>
  tracking: Record<string, unknown>
  consent?: Record<string, unknown>
  createdAt: string
}

export function isN8nConfigured(): boolean {
  return Boolean(process.env.N8N_WEBHOOK_URL)
}

export async function routeLead(payload: AutomationPayload): Promise<{ demoMode: boolean; status: number }> {
  const url = process.env.N8N_WEBHOOK_URL || process.env.AIRTABLE_WEBHOOK_FALLBACK_URL
  if (!url) {
    return { demoMode: true, status: 204 }
  }

  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (process.env.N8N_WEBHOOK_SECRET) {
    headers['x-webhook-secret'] = process.env.N8N_WEBHOOK_SECRET
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`n8n ${response.status}: ${text.slice(0, 300)}`)
  }

  return { demoMode: false, status: response.status }
}
