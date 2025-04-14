export const getDatePrefix = (year?: number | null, month?: number | null) => {
  if (year == null) {
    return ''
  }
  if (month == null) {
    return `${year}`
  }
  const monthStr = month < 10 ? `0${month}` : `${month}`
  return `${year}-${monthStr}`
}
