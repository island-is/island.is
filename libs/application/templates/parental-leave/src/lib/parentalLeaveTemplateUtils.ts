import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInDays from 'date-fns/differenceInDays'
import isSameMonth from 'date-fns/isSameMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import { ApplicationContext } from '@island.is/application/core'
import { YES, NO } from '../constants'
import { SchemaFormValues } from './dataSchema'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  return currentApplicationAnswers.employer.isSelfEmployed === NO
}

export function needsOtherParentApproval(context: ApplicationContext) {
  const currentApplicationAnswers = context.application
    .answers as SchemaFormValues

  return currentApplicationAnswers.requestRights.isRequestingRights === YES
}

export function isDev() {
  return process.env.NODE_ENV === 'development' || process.env.name === 'dev'
}

/**
 * Calculates the number of days between two dates according to VMST rules
 */
export function calculatePLBetweenDates(start: Date, end: Date) {
  if (end < start) {
    throw new Error('Error')
  }

  if (isSameMonth(start, end)) {
    const daysBetween = differenceInDays(start, end)

    return Math.round(daysBetween / getDaysInMonth(start))
  }

  const ratioLeftOfStartMonth = 1 - start.getDate() / getDaysInMonth(start)
  const ratioUsedOfEndMonth = end.getDate() / getDaysInMonth(end)

  const daysSpentInStartMonth = Math.round(ratioLeftOfStartMonth * 30)
  const daysSpentInEndMonth = Math.round(ratioUsedOfEndMonth * 30)

  const differenceInFullMonths = differenceInMonths(start, end)
  const extraDaysFromGoingOverFullMonths =
    differenceInFullMonths < 2 ? 0 : differenceInFullMonths * 30

  return (
    daysSpentInStartMonth +
    daysSpentInEndMonth +
    extraDaysFromGoingOverFullMonths
  )
}

/**
 * This is a utility function to add or subtract days from a date using the
 * rules provided by VMST
 */
export function addPLDays(date: Date, daysToAdd: number) {}
