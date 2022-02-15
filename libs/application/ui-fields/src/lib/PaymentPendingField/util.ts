export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () =>
  !!window.document.location.href.match(/\?done$/)
