export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () => {
  const params = new URLSearchParams(window.document.location.search)
  return params.has('done') || params.has('cancelled') || params.has('invoice')
}

// Is it done or cancelled?
export const getRedirectStatus = () => {
  const params = new URLSearchParams(window.document.location.search)
  if (params.has('done')) return 'done'
  if (params.has('cancelled')) return 'cancelled'
  if (params.has('invoice')) return 'invoice'
  return undefined
}

export const removeCancelledfromHref = () => {
  const href = window.document.location.href
  window.history.replaceState({}, '', href.replace('?cancelled', ''))
}
