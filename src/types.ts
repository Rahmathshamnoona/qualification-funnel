export type FunnelPhase = 'start' | 'questions' | 'email' | 'pii' | 'outcome'

export type TrackingContext = {
  fbp?: string
  fbc?: string
  fbclid?: string
  ttclid?: string
  gclid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  landingUrl?: string
  referrer?: string
}

export type ConsentRecord = {
  tcpa: boolean
  text: string
  timestamp: string
  version: string
}

export type LeadPayload = {
  leadId: string
  sessionId: string
  eventId: string
  eventName: 'PageView' | 'Lead' | 'CompleteRegistration'
  eventSourceUrl: string
  answers: Record<string, string>
  contact: {
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
    zip?: string
    gender?: string
    ageRange?: string
    over40?: string
  }
  tracking: TrackingContext
  consent?: ConsentRecord
}

export type LeadResponse = {
  ok: boolean
  leadId: string
  eventId: string
  qualified: boolean
  grade: string
  estimatedMonthly: number
  matchQuality: number
  meta: { queued: boolean; status: string }
  automation: { queued: boolean; status: string }
  demoMode: boolean
}
