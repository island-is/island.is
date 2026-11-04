/**
 * Check if a date is valid, i.e. not "Invalid Date"
 * @param date
 */
export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime())
}
