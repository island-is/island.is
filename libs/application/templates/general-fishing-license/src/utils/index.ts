export const formatPhonenumber = (value: string) => {
  const splitAt = (index: number) => (x: string) =>
    [x.slice(0, index), x.slice(index)]
  if (value.length > 3) return splitAt(3)(value).join('-')
  return value
}

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getRedirectUrl = (paymentUrl: string) => {
  const returnUrl = window.document.location.href + '?done'
  return `${paymentUrl}&returnURL=${encodeURIComponent(returnUrl)}`
}

export const isComingFromRedirect = () =>
  !!window.document.location.href.match(/\?done$/)
