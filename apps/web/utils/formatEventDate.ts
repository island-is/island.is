export const formatEventDate = (
  format: (date: Date, dateFormat: string) => string,
  separator: string,
  startDate?: string,
  endDate?: string | null,
) => {
  if (!startDate) {
    return ''
  }

  if (!endDate) {
    return `${format(new Date(startDate), 'do MMMM yyyy')}`
  }

  return `${format(new Date(startDate), 'do MMMM')}${separator}${format(
    new Date(endDate),
    'do MMMM yyyy',
  )}`
}
