import { DAYS_IN_MONTH } from './lib/directorateOfLabour.utils'

export const maxDaysToGiveOrReceive = 45
export const defaultMonths = 6
export const additionalSingleParentMonths = 6
export const minMonths =
  (defaultMonths * DAYS_IN_MONTH - maxDaysToGiveOrReceive) / DAYS_IN_MONTH
export const maxMonths =
  (defaultMonths * DAYS_IN_MONTH + maxDaysToGiveOrReceive) / DAYS_IN_MONTH
export const minPeriodDays = 14
export const usageMinMonths = 0.5
export const usageMaxMonths = 24
export const daysInMonth = DAYS_IN_MONTH
export const minimumPeriodStartBeforeExpectedDateOfBirth = 1 // can start 1 month before
export const minimumRatio = 0.01
