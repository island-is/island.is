import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import differenceInMonths from 'date-fns/differenceInMonths'
import isWithinInterval from 'date-fns/isWithinInterval'
import isNumber from 'lodash/isNumber'
import {
  Application,
  AnswerValidator,
  AnswerValidationError,
} from '@island.is/application/core'

import { getExpectedDateOfBirth } from '../parentalLeaveUtils'
import { Period } from '../types'
import { minPeriodDays, usageMaxMonths } from '../config'

const buildValidationError = (
  path: string,
  index?: number,
): ((message: string, field?: string) => AnswerValidationError) => (
  message,
  field,
) => {
  if (field && isNumber(index)) {
    return {
      message,
      path: `${path}[${index}].${field}`,
    }
  }

  return {
    message,
    path,
  }
}

const FIRST_PERIOD_START = 'firstPeriodStart'
const PERIODS = 'periods'

// TODO: Add translation messages here
export const answerValidators: Record<string, AnswerValidator> = {
  [FIRST_PERIOD_START]: (_, application: Application) => {
    const buildError = buildValidationError(FIRST_PERIOD_START)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)

    if (!expectedDateOfBirth) {
      return buildError(
        'We haven’t been able to fetch automatically the date of birth for your baby. Please try again later.',
      )
    }

    return undefined
  },
  [PERIODS]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]
    const newPeriodIndex = periods.length - 1
    const buildError = buildValidationError(PERIODS, newPeriodIndex)
    const period = periods[newPeriodIndex]
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    const dob = expectedDateOfBirth!

    if (period?.startDate !== undefined) {
      const field = 'startDate'
      const { startDate } = period

      // We need a valid start date
      if (typeof startDate !== 'string' || !isValid(parseISO(startDate))) {
        return buildError('The start date is not valid.', field)
      }

      // Start date needs to be after or equal to the expectedDateOfBirth
      if (startDate < dob) {
        return buildError(
          'Start date cannot be before expected date of birth.',
          field,
        )
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(startDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(
          `You can't apply for a period beyond ${usageMaxMonths} months from the DOB.`,
          field,
        )
      }

      // We check if the startDate is within previous periods saved
      if (
        periods
          // We filtering out the new period we are adding
          .filter((_, index) => index !== newPeriodIndex)
          .some(
            (otherPeriod) =>
              otherPeriod.startDate &&
              otherPeriod.endDate &&
              isWithinInterval(parseISO(startDate), {
                start: parseISO(otherPeriod.startDate),
                end: parseISO(otherPeriod.endDate),
              }),
          )
      ) {
        return buildError(
          `A new period cannot start within another period already saved.`,
          field,
        )
      }
    }

    if (period?.endDate !== undefined) {
      const field = 'endDate'
      const { startDate, endDate } = period

      // We need a valid end date
      if (typeof endDate !== 'string' || !isValid(parseISO(endDate))) {
        return buildError('The end date is not valid.', field)
      }

      // We check if endDate is after startDate
      if (endDate < startDate) {
        return buildError('End date cannot be before the start date.', field)
      }

      // We check if the user selected at least the minimum period required
      if (
        differenceInDays(parseISO(endDate), parseISO(startDate)) < minPeriodDays
      ) {
        return buildError(
          `You cannot apply for a period shorter than ${minPeriodDays} days.`,
          field,
        )
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(endDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(
          `You can't apply for a period beyond ${usageMaxMonths} months from the DOB.`,
          field,
        )
      }

      // We check if the endDate is within previous periods saved
      if (
        periods
          // We filtering out the new period we are adding
          .filter((_, index) => index !== newPeriodIndex)
          .some(
            (otherPeriod) =>
              otherPeriod.startDate &&
              otherPeriod.endDate &&
              isWithinInterval(parseISO(endDate), {
                start: parseISO(otherPeriod.startDate),
                end: parseISO(otherPeriod.endDate),
              }),
          )
      ) {
        return buildError(
          `A new period cannot end within another period already saved.`,
          field,
        )
      }
    }

    if (period?.ratio !== undefined) {
      const field = 'ratio'
      const { startDate, endDate, ratio } = period
      const diff = differenceInDays(parseISO(endDate), parseISO(startDate))
      const diffWithRatio = (diff * ratio) / 100

      // We want to make sure the ratio doesn't affect the minimum number of days selected
      if (diffWithRatio < minPeriodDays) {
        return buildError(
          `The minimum is ${minPeriodDays} days of leave, you've chosen ${diff} days at ${ratio}% which ends up as only ${diffWithRatio} days leave.`,
          field,
        )
      }
    }

    return undefined
  },
}
