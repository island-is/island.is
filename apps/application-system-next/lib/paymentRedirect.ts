export type PaymentRedirectStatus = 'done' | 'cancelled'

/**
 * Which way the payment gateway sent the user back: the return URL ends in
 * `?done` or `?cancelled`. The query string is parsed rather than matched as
 * text, because the screen id is added to it (`?cancelled=&screen=<id>`).
 */
export const getPaymentRedirectStatus = (
  search: string,
): PaymentRedirectStatus | undefined => {
  const params = new URLSearchParams(search)

  if (params.has('done')) return 'done'
  if (params.has('cancelled')) return 'cancelled'
  return undefined
}

/** Returns `href` as a path without the `cancelled` param, keeping the rest. */
export const removeCancelledParam = (href: string): string => {
  const url = new URL(href)
  url.searchParams.delete('cancelled')
  return `${url.pathname}${url.search}${url.hash}`
}
