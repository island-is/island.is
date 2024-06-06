import { EXPIRATION_LIMIT_MONTHS } from '../lib/constants'

export const isWithinExpirationDate = (dateStr: string) => {
  const inputDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate the date x months from today based on expiration limit
  const xMonthsLater = new Date(today)
  xMonthsLater.setMonth(xMonthsLater.getMonth() + EXPIRATION_LIMIT_MONTHS)

  // Check if the input date is within the expiration limit
  return inputDate >= today && inputDate <= xMonthsLater
}
