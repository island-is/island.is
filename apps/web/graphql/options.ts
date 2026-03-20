import type { ScreenContext } from '../types'

export interface ClientOptions {
  bypassCache?: string
  clientIp?: string
}

export function optionsFromContext(
  ctx?: Partial<ScreenContext>,
): ClientOptions {
  const req = ctx?.req
  const forwardedFor = req?.headers?.['x-forwarded-for']
  const rawIp = forwardedFor
    ? Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(',')[0].trim()
    : req?.socket?.remoteAddress
  // Strip IPv4-mapped IPv6 prefix (e.g. "::ffff:192.168.1.1" → "192.168.1.1")
  const clientIp = rawIp?.replace(/^::ffff:/, '')

  return {
    bypassCache: ctx?.query?.['bypass-cache']?.toString(),
    clientIp,
  }
}

export function optionsFromWindow(): ClientOptions {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    bypassCache: new URLSearchParams(window.location.search).get(
      'bypass-cache',
    ),
  }
}
