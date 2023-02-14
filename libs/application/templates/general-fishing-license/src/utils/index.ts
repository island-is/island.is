export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () =>
  !!window.document.location.href.match(/\?done$/)
