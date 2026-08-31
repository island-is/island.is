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

export const is15DaysOrMoreFromDate = (
  date: string | Date,
  currentDate: Date = new Date(),
): boolean => {
  const newDate = new Date(date)
  const diffTime = currentDate.getTime() - newDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays >= 15
}

export const DAY_RATE_MIN_DAYS = 15

/**
 * First calendar day on which a vehicle that went on the day rate on
 * `validFrom` can be moved back to the kilometre rate.
 *
 * Derived by probing `is15DaysOrMoreFromDate` rather than by adding days to
 * `validFrom`: that predicate rounds the elapsed days up, so the cutoff lands
 * a day earlier than the raw 15 day figure suggests. Each candidate day is
 * tested at midday so the exact midnight boundary cannot flip the answer.
 */
export const getDayRateChangeableFromDate = (
  date: string | Date,
  currentDate: Date = new Date(),
): Date => {
  const candidate = new Date(currentDate)
  candidate.setHours(0, 0, 0, 0)

  for (let dayOffset = 0; dayOffset <= DAY_RATE_MIN_DAYS; dayOffset++) {
    const midday = new Date(candidate)
    midday.setHours(12, 0, 0, 0)

    if (is15DaysOrMoreFromDate(date, midday)) return candidate

    candidate.setDate(candidate.getDate() + 1)
  }

  return candidate
}

export const areLessThan7DaysLeftOfMonth = (): boolean => {
  const now = new Date()
  const daysLeftInMonth =
    new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
  return daysLeftInMonth <= 7
}
