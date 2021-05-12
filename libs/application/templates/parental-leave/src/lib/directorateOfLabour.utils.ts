import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths'
import isSameMonth from 'date-fns/isSameMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import isSameDay from 'date-fns/isSameDay'
import {
  ParentalLeave,
  ParentalLeaveEntitlement,
  ParentalLeavePeriod,
} from '@island.is/api/domains/directorate-of-labour'

// VMST rule for the number of days in each month of the year
export const DAYS_IN_MONTH = 30
const ONE_DAY = 24 * 3600 * 1000

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
const fullMonthDates = (start: Date, end: Date) => {
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
    const isFullMonth = fullMonthDates(start, end)
    const ratioOfDaysUsed =
      (end.getDate() - start.getDate()) / getDaysInMonth(start)
    const daysUsed = Math.round(ratioOfDaysUsed * DAYS_IN_MONTH)

    return isFullMonth ? DAYS_IN_MONTH : daysUsed
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
      const days = calculateNumberOfDaysForOnePeriod(from, to)
      const daysWithRatio = Math.round((days * cur.ratio) / 100)

      return acc + daysWithRatio
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

  const application = (applications ?? []).find(
    (a) =>
      isSameDay(new Date(a.dateOfBirth), new Date(dateOfBirth)) ||
      isSameDay(new Date(a.expectedDateOfBirth), new Date(dateOfBirth)),
  )

  // No application found for the date of birth
  if (!application) {
    return monthsToDays(rights.independentMonths)
  }

  const availableDays = monthsToDays(rights.independentMonths)
  const existingDays = calculateExistingNumberOfDays(application.periods)

  return availableDays - existingDays
}

/**
 * Calculate a new date according to VMST's rules
 */
export const calculateDateWithNewPeriod = (start: Date, daysToUse: number) => {
  let daysLeft = daysToUse
  let endDate = start

  while (daysLeft > 0) {
    const currentDayOfMonth = endDate.getDate()
    const daysInMonth = getDaysInMonth(new Date(endDate))

    const VMSTDayToRealDayMultiplier = daysInMonth / DAYS_IN_MONTH
    const realDayToVMSTDayMultiplier = DAYS_IN_MONTH / daysInMonth

    const daysLeftOfMonth = daysInMonth - currentDayOfMonth + 1
    const daysLeftOfMonthCost = daysLeftOfMonth * realDayToVMSTDayMultiplier

    if (daysLeftOfMonthCost < daysLeft) {
      const date = new Date(endDate.getTime() + daysLeftOfMonth * ONE_DAY)

      endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
      )

      daysLeft -= daysLeftOfMonthCost
    } else {
      const realDaysLeftToSpend = daysLeft * VMSTDayToRealDayMultiplier
      const realDecimal = realDaysLeftToSpend - Math.floor(realDaysLeftToSpend)

      // Revisit this
      const days =
        daysLeft === DAYS_IN_MONTH && daysInMonth === 28
          ? daysInMonth - 1
          : realDecimal > 0.49
          ? realDaysLeftToSpend + 1
          : realDaysLeftToSpend

      const date = new Date(endDate.getTime() + days * ONE_DAY)

      endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
      )

      daysLeft = 0
    }
  }

  return endDate
}
