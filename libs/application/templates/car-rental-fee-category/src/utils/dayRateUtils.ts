import { DayRateEntryModel } from '@island.is/clients-rental-day-rate'

export const isDayRateEntryActive = (
  entry: DayRateEntryModel,
  currentDate: Date = new Date(),
): boolean => {
  const validFrom = new Date(entry.validFrom || '')
  const validTo = entry.validTo ? new Date(entry.validTo) : null

  return validFrom <= currentDate && (!validTo || validTo > currentDate)
}

export const hasActiveDayRate = (
  entries: DayRateEntryModel[],
  currentDate: Date = new Date(),
): boolean => {
  return entries.some((entry) => isDayRateEntryActive(entry, currentDate))
}

export const is30DaysOrMoreFromDate = (
  date: string | Date,
  currentDate: Date = new Date(),
): boolean => {
  const newDate = new Date(date)
  const diffTime = currentDate.getTime() - newDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // 30 days

  return diffDays >= 30
}

export const areLessThan7DaysLeftOfMonth = (): boolean => {
  const now = new Date()
  const daysLeftInMonth =
    new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
  return daysLeftInMonth <= 7
}
