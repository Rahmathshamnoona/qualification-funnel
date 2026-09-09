type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] }

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

let loaded = false

export function initPixel(): void {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined
  if (!pixelId || loaded) return
  loaded = true

  const fbq: Fbq = (...args: unknown[]) => {
    ;(fbq.queue ??= []).push(args)
  }
  window.fbq = fbq
  window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', pixelId)
}

export function trackPixel(
  eventName: 'PageView' | 'Lead' | 'CompleteRegistration' | 'ViewContent',
  eventId: string,
  params: Record<string, unknown> = {},
): void {
  initPixel()
  window.fbq?.('track', eventName, params, { eventID: eventId })
}
