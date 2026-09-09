import { hashUserData, type HashedUserData, type UserDataInput } from './hash'

export type MetaEventInput = {
  eventName: string
  eventId: string
  eventSourceUrl: string
  eventTime?: number
  user: UserDataInput
  customData?: Record<string, unknown>
}

export type MetaSendResult = {
  demoMode: boolean
  eventsReceived?: number
  fbtraceId?: string
  raw?: unknown
}

export function isMetaConfigured(): boolean {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN)
}

export async function sendMetaEvent(input: MetaEventInput): Promise<MetaSendResult> {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  const version = process.env.META_GRAPH_VERSION || 'v21.0'
  const userData: HashedUserData = hashUserData(input.user)

  const event = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    action_source: 'website',
    user_data: userData,
    custom_data: input.customData ?? {},
  }

  if (!pixelId || !token) {
    return { demoMode: true, raw: { skipped: 'meta_not_configured', event } }
  }

  const body: Record<string, unknown> = {
    data: [event],
    access_token: token,
    partner_agent: 'benefitpath-takehome/1.0',
  }
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE
  }

  const url = `https://graph.facebook.com/${version}/${pixelId}/events`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = (await response.json()) as {
    events_received?: number
    fbtrace_id?: string
    error?: { message?: string }
  }

  if (!response.ok) {
    throw new Error(json.error?.message || `Meta CAPI ${response.status}`)
  }

  return {
    demoMode: false,
    eventsReceived: json.events_received,
    fbtraceId: json.fbtrace_id,
    raw: json,
  }
}
