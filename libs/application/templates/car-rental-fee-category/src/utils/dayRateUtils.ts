import { DayRateEntryModel } from '@island.is/clients-rental-day-rate'
import addDays from 'date-fns/addDays'

export const isDayRateEntryActive = (
  entry: DayRateEntryModel,
  currentDate: Date = new Date(),
): boolean => {
  const validFrom = new Date(entry.validFrom || '')
  const validTo = entry.validTo ? new Date(entry.validTo) : null
  // Dayrate changes active the day after its requested to be set
  // So we also look 1 day into the future just in case
  return (
    (validFrom <= currentDate || validFrom <= addDays(currentDate, 1)) &&
    (!validTo || validTo > currentDate)
  )
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
