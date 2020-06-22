export default (num: number): string | number => {
  const toLocale = (value: number): string => {
    return Number(value.toFixed(1).replace(/\.0$/, '')).toLocaleString('de-DE')
  }

  if (num >= 1000000000) {
    return toLocale(num / 1000000000) + 'G'
  }
  if (num >= 1000000) {
    return toLocale(num / 1000000) + 'M'
  }
  if (num >= 1000) {
    return toLocale(num / 1000) + 'k'
  }
  return num.toLocaleString('de-DE')
}
