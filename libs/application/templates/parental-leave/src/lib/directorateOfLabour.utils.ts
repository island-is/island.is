import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths'
import differenceInDays from 'date-fns/differenceInDays'
import isSameMonth from 'date-fns/isSameMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import addDays from 'date-fns/addDays'
import isSameDay from 'date-fns/isSameDay'
import { errorMessages } from './messages'
import {
  ParentalLeave,
  Right as ParentalLeaveEntitlement,
  Period as ParentalLeavePeriod,
} from '@island.is/clients/vmst'

// VMST rule for the number of days in each month of the year
export const DAYS_IN_MONTH = 30

/**
 * Convert a number of days into a floored number of months
 */
export const daysToMonths = (days: number) => {
  const fullMonths = Math.floor(days / DAYS_IN_MONTH)
  const restDays = days % DAYS_IN_MONTH
  const ratio = restDays / DAYS_IN_MONTH

  return fullMonths + ratio
}

/**
 * Convert a number of months into a floored number of days
 */
export const monthsToDays = (months: number) => {
  return Math.floor(months * DAYS_IN_MONTH)
}

/**
 * Return true if the dates are the first day and the last day of the same month
 */
const isFullMonth = (start: Date, end: Date) => {
  if (!isSameMonth(start, end)) {
    return false
  }

  return start.getDate() === 1 && end.getDate() === getDaysInMonth(end)
}

/**
 * Calculates the number of days between two dates according to VMST's rules
 */
export const calculateNumberOfDaysForOnePeriod = (start: Date, end: Date) => {
  if (end < start) {
    throw new Error('The end date cannot be before the start date.')
  }

  if (isSameMonth(start, end)) {
    const fullMonth = isFullMonth(start, end)
    const ratioOfDaysUsed =
      (end.getDate() - start.getDate()) / getDaysInMonth(start)
    const daysUsed = Math.round(ratioOfDaysUsed * DAYS_IN_MONTH)

    return fullMonth ? DAYS_IN_MONTH : daysUsed
  }

  const ratioLeftOfStartMonth = 1 - start.getDate() / getDaysInMonth(start)
  const ratioUsedOfEndMonth = end.getDate() / getDaysInMonth(end)

  const daysSpentInStartMonth = Math.round(
    ratioLeftOfStartMonth * DAYS_IN_MONTH,
  )
  const daysSpentInEndMonth = Math.round(ratioUsedOfEndMonth * DAYS_IN_MONTH)

  const differenceInFullMonths = differenceInMonths(end, start)
  const monthsApart = differenceInCalendarMonths(end, start)

  const isOneMonthBetweenStartAndEnd =
    daysSpentInStartMonth + daysSpentInEndMonth >= DAYS_IN_MONTH
  const diff = differenceInFullMonths - (isOneMonthBetweenStartAndEnd ? 1 : 0)

  const extraDaysFromGoingOverFullMonths =
    monthsApart < 2 ? 0 : diff * DAYS_IN_MONTH

  return (
    daysSpentInStartMonth +
    daysSpentInEndMonth +
    extraDaysFromGoingOverFullMonths
  )
}

/**
 * Calculate number of days already applied for in an existing periods of an application
 */
export const calculateExistingNumberOfDays = (periods: ParentalLeavePeriod[]) =>
  periods
    .filter((period) => period.approved)
    .reduce((acc, cur) => {
      const from = new Date(cur.from)
      const to = new Date(cur.to)

      if (cur.ratio.toString().startsWith('D')) {
        const [, rawDays] = cur.ratio.toString().split('D')[1]

        return acc + Number(rawDays)
      }
      const ratio = Number(cur.ratio)

      return acc + calculatePeriodLength(from, to, ratio / 100)
    }, 0)

/**
 * Calculate number of days (rights) remaining for the applicant
 */
export const calculateRemainingNumberOfDays = (
  dateOfBirth: string | null,
  applications: ParentalLeave[] | null,
  rights: ParentalLeaveEntitlement,
) => {
  // Without date of birth or rights there is no days available
  if (
    !dateOfBirth ||
    (!rights.independentMonths && rights.independentMonths !== 0)
  ) {
    return 0
  }

  // No more rights available
  if (rights?.independentMonths === 0) {
    return 0
  }

  const application = (applications ?? []).find((a) => {
    const matchesCurrentDateOfBirth = !a.dateOfBirth
      ? false
      : isSameDay(new Date(a.dateOfBirth), new Date(dateOfBirth))

    const matchesCurrentExpectedDateOfBirth = !a.expectedDateOfBirth
      ? false
      : isSameDay(new Date(a.expectedDateOfBirth), new Date(dateOfBirth))

    return matchesCurrentDateOfBirth || matchesCurrentExpectedDateOfBirth
  })

  // No application found for the date of birth
  if (!application) {
    return monthsToDays(rights.independentMonths)
  }

  const availableDays = monthsToDays(rights.independentMonths)
  const existingDays = calculateExistingNumberOfDays(application.periods ?? [])

  return availableDays - existingDays
}

export const calculatePeriodLength = (
  start: Date,
  end: Date,
  percentage = 1,
  months?: number,
) => {
  if (months) {
    return months * 30
  }
  if (end < start) {
    throw errorMessages.periodsEndDateBeforeStartDate
  }

  if (start === end) {
    throw errorMessages.periodsEndDateMinimumPeriod
  }

  let currentDate = start
  let cost = 0

  while (currentDate <= end) {
    const daysInMonth = getDaysInMonth(currentDate)
    const dayOfMonth = currentDate.getDate()
    const daysTillEndOfMonth = daysInMonth - dayOfMonth
    const daysLeftToEnd = differenceInDays(end, currentDate)
    const daysLeft = Math.min(daysTillEndOfMonth, daysLeftToEnd)
    const dateAtEndOfIteration = addDays(currentDate, daysLeft)

    let costOfMonth = 0

    if (dateAtEndOfIteration.getDate() === daysInMonth) {
      costOfMonth = 30 - dayOfMonth + 1
    } else {
      costOfMonth = end.getDate() - dayOfMonth + 1
    }

    cost += Math.round(costOfMonth * percentage)
    currentDate = addDays(currentDate, daysTillEndOfMonth + 1)
  }

  return cost
}

export const calculateMaxPercentageForPeriod = (
  start: Date,
  end: Date,
  rights: number,
): number | null => {
  const fullLength = calculatePeriodLength(start, end)

  if (fullLength <= rights) {
    return 1
  }

  let percentage = Math.round((rights / fullLength) * 100)
  let lengthWithPercentage = calculatePeriodLength(start, end, percentage)

  while (lengthWithPercentage > rights && percentage > 0) {
    percentage -= 1

    lengthWithPercentage = calculatePeriodLength(start, end, percentage / 100)
  }

  if (lengthWithPercentage > rights) {
    return null
  }

  return percentage / 100
}

export const calculateMinPercentageForPeriod = (
  start: Date,
  end: Date,
): number | null => {
  let percentage = 1
  let lengthWithPercentage = calculatePeriodLength(start, end, percentage / 100)

  while (lengthWithPercentage <= 0 || percentage >= 100) {
    percentage += 1

    lengthWithPercentage = calculatePeriodLength(start, end, percentage / 100)
  }

  if (lengthWithPercentage === 0) {
    return null
  }

  return percentage / 100
}
