import type { LeadPayload, LeadResponse } from '../types'

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const response = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Lead request failed (${response.status})`)
  }

  return (await response.json()) as LeadResponse
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^1/, '').slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^1/, '').slice(0, 10)
}

export function isValidPhone(raw: string): boolean {
  return phoneDigits(raw).length === 10
}

export function isValidZip(raw: string): boolean {
  return /^\d{5}$/.test(raw.trim())
}

export const TCPA_TEXT =
  "By clicking continue, I provide my ESIGN signature and express written consent to BenefitPath and its partner advocates to contact me by calls and SMS, including with automated technology. Consent is not required to get help. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out."

export const TCPA_VERSION = '2026-09-1'
