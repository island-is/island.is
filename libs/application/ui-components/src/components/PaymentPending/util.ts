export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () => {
  return (
    !!window.document.location.href.match(/\?done$/) ||
    !!window.document.location.href.match(/\?cancelled$/)
  )
}

// Is it done or cancelled?
export const getRedirectStatus = () => {
  return window.document.location.href.match(/\?done$/)
    ? 'done'
    : window.document.location.href.match(/\?cancelled$/)
    ? 'cancelled'
    : undefined
}

export const removeCancelledfromHref = () => {
  const href = window.document.location.href
  window.history.replaceState({}, '', href.replace('?cancelled', ''))
}
