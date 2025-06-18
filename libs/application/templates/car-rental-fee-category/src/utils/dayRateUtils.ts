import { DayRateEntryModel } from "@island.is/clients-rental-day-rate"

export const isDayRateEntryActive = (entry: DayRateEntryModel, currentDate: Date = new Date()): boolean => {
    const validFrom = new Date(entry.validFrom || '')
    const validTo = entry.validTo ? new Date(entry.validTo) : null
  
    return validFrom <= currentDate && (!validTo || validTo > currentDate)
}

export const hasActiveDayRate = (entries: DayRateEntryModel[], currentDate: Date = new Date()): boolean => {
  return entries.some(entry => isDayRateEntryActive(entry, currentDate))
}