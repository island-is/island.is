import { DAYS_IN_MONTH } from './lib/directorateOfLabour.utils'

export const defaultMonths = 6
export const usageMinMonths = 0.5
export const usageMaxMonths = 24
export const minPeriodDays = 14
export const minimumPeriodStartBeforeExpectedDateOfBirth = 30 // can start 30 days before
export const minimumRatio = 0.01

export const maxDaysToGiveOrReceive = 45
export const additionalSingleParentMonths = 6
export const minMonths =
  (defaultMonths * DAYS_IN_MONTH - maxDaysToGiveOrReceive) / DAYS_IN_MONTH
export const maxMonths =
  (defaultMonths * DAYS_IN_MONTH + maxDaysToGiveOrReceive) / DAYS_IN_MONTH
export const daysInMonth = DAYS_IN_MONTH

export const defaultMultipleBirthsMonths = 3
export const multipleBirthsDefaultDays = 90
