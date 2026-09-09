import { createHash } from 'node:crypto'

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return digits
  return digits
}

export function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

export function normalizeZip(zip: string): string {
  return zip.replace(/\D/g, '').slice(0, 5)
}

export function normalizeGender(value: string): 'm' | 'f' | undefined {
  const v = value.trim().toLowerCase()
  if (v === 'male' || v === 'm') return 'm'
  if (v === 'female' || v === 'f') return 'f'
  return undefined
}

export function isCaliforniaZip(zip: string): boolean {
  const n = Number(normalizeZip(zip))
  return n >= 90001 && n <= 96162
}

export type UserDataInput = {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  zip?: string
  gender?: string
  externalId?: string
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
}

export type HashedUserData = {
  em?: string[]
  ph?: string[]
  fn?: string[]
  ln?: string[]
  zp?: string[]
  ge?: string[]
  country?: string[]
  external_id?: string[]
  fbp?: string
  fbc?: string
  client_ip_address?: string
  client_user_agent?: string
}

export function hashUserData(input: UserDataInput): HashedUserData {
  const data: HashedUserData = {}

  if (input.email) data.em = [sha256(normalizeEmail(input.email))]
  if (input.phone) {
    const phone = normalizePhone(input.phone)
    if (phone.length >= 11) data.ph = [sha256(phone)]
  }
  if (input.firstName) data.fn = [sha256(normalizeName(input.firstName))]
  if (input.lastName) data.ln = [sha256(normalizeName(input.lastName))]
  if (input.zip) {
    const zip = normalizeZip(input.zip)
    if (zip.length === 5) data.zp = [sha256(zip)]
  }
  const gender = input.gender ? normalizeGender(input.gender) : undefined
  if (gender) data.ge = [sha256(gender)]
  if (input.email || input.phone || input.zip) data.country = [sha256('us')]
  if (input.externalId) data.external_id = [sha256(input.externalId)]
  if (input.fbp) data.fbp = input.fbp
  if (input.fbc) data.fbc = input.fbc
  if (input.clientIpAddress) data.client_ip_address = input.clientIpAddress
  if (input.clientUserAgent) data.client_user_agent = input.clientUserAgent

  return data
}

/** Rough Event Match Quality proxy (0–10) from identifiers we actually send. */
export function estimateMatchQuality(data: HashedUserData): number {
  let score = 0
  if (data.em) score += 3.2
  if (data.ph) score += 2.8
  if (data.fn && data.ln) score += 1.2
  else if (data.fn || data.ln) score += 0.4
  if (data.zp) score += 0.6
  if (data.ge) score += 0.3
  if (data.fbp) score += 0.8
  if (data.fbc) score += 1.1
  if (data.external_id) score += 0.6
  if (data.client_ip_address && data.client_user_agent) score += 0.4
  return Math.min(10, Math.round(score * 10) / 10)
}
