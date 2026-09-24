export const formatIsDateLong = (value: string | undefined): string => {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString('is-IS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Returns '-' when the value is empty; used for optional table cells (e.g. dateTo)
export const formatIsDateLongOrDash = (value: string | undefined): string =>
  value ? formatIsDateLong(value) : '-'

export const formatIsCurrency = (
  value: string | number | undefined,
): string => {
  if (value === undefined || value === null || value === '') return ''
  const num = Number(value)
  if (isNaN(num)) return String(value)
  return `${num.toLocaleString('is-IS')} kr.`
}
