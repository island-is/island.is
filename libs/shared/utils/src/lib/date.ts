/**
 * Gets yesterday's date from current date, in UTC format.
 */
export const getYesterday = (date: Date) => {
  date.setDate(date.getDate() - 1)

  return date
}
