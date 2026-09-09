export function readCookie(name: string): string | undefined {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return match?.split('=').slice(1).join('=')
}

export function facebookClickId(): { fbp?: string; fbc?: string; fbclid?: string } {
  const fbp = readCookie('_fbp')
  const existingFbc = readCookie('_fbc')
  const fbclid = new URLSearchParams(window.location.search).get('fbclid') ?? undefined
  const fbc =
    existingFbc ||
    (fbclid && fbclid.length > 5 ? `fb.1.${Date.now()}.${fbclid}` : undefined)
  return { fbp, fbc, fbclid }
}

export function collectTracking() {
  const params = new URLSearchParams(window.location.search)
  const fb = facebookClickId()
  return {
    ...fb,
    ttclid: params.get('ttclid') ?? readCookie('_ttp'),
    gclid: params.get('gclid') ?? undefined,
    utm_source: params.get('utm_source') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    utm_content: params.get('utm_content') ?? undefined,
    utm_term: params.get('utm_term') ?? undefined,
    landingUrl: window.location.href,
    referrer: document.referrer || undefined,
  }
}
