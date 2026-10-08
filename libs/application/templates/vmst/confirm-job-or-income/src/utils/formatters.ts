export const formatIsDate = (value: string | undefined): string => {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString('is-IS', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Returns '-' when the value is empty; used for optional table cells (e.g. dateTo)
export const formatIsDateOrDash = (value: string | undefined): string =>
  value ? formatIsDate(value) : '-'

export const formatIsCurrency = (
  value: string | number | undefined,
): string => {
  if (value === undefined || value === null || value === '') return ''
  const num = Number(value)
  if (isNaN(num)) return String(value)
  return `${num.toLocaleString('is-IS')} kr.`
}
