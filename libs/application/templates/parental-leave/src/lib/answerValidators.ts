import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import differenceInMonths from 'date-fns/differenceInMonths'
import isWithinInterval from 'date-fns/isWithinInterval'
import subMonths from 'date-fns/subMonths'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'

import {
  Application,
  AnswerValidator,
  getValueViaPath,
  Answer,
  buildValidationError,
  coreErrorMessages,
  StaticText,
} from '@island.is/application/core'

import { Period } from '../types'
import { minPeriodDays, usageMaxMonths } from '../config'
import { NO, YES } from '../constants'
import { isValidEmail } from './isValidEmail'
import { errorMessages } from './messages'
import {
  getApplicationAnswers,
  getExpectedDateOfBirth,
} from './parentalLeaveUtils'
import { filterValidPeriods } from '..'

const EMPLOYER = 'employer'
const FIRST_PERIOD_START = 'firstPeriodStart'
const PERIODS = 'periodsValidator'

export const answerValidators: Record<string, AnswerValidator> = {
  [EMPLOYER]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>
    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${EMPLOYER}.${path}`)(message)
    const isSelfEmployed = getValueViaPath(
      application.answers,
      'employer.isSelfEmployed',
    )

    if (obj.isSelfEmployed === '') {
      return buildError(coreErrorMessages.defaultError, 'isSelfEmployed')
    }

    // If the new answer is the `isSelfEmployed` step, it means we didn't enter the email address yet
    if (obj.isSelfEmployed) {
      return undefined
    }

    if (
      isSelfEmployed === YES &&
      isEmpty((obj.selfEmployed as { file: any[] }).file)
    ) {
      return buildError(errorMessages.requiredAttachment, 'selfEmployed.file')
    }

    if (isSelfEmployed === NO && isEmpty(obj?.email)) {
      return buildError(errorMessages.employerEmail, 'email')
    }

    if (isSelfEmployed === NO && !isValidEmail(obj.email as string)) {
      return buildError(errorMessages.email, 'email')
    }

    return undefined
  },
  [FIRST_PERIOD_START]: (_, application: Application) => {
    const buildError = buildValidationError(FIRST_PERIOD_START)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)

    if (!expectedDateOfBirth) {
      return buildError(errorMessages.dateOfBirth)
    }

    return undefined
  },
  [PERIODS]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]

    if (periods.length === 0) {
      return {
        path: 'periods',
        message: 'Þú þarft að velja tímabil',
      }
    }

    const newPeriodIndex = periods.length - 1
    const period = periods[newPeriodIndex]
    const buildError = buildValidationError(PERIODS, newPeriodIndex)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    const dob = expectedDateOfBirth as string
    const { periods: answeredPeriods } = getApplicationAnswers(
      application.answers,
    )
    const lastAnsweredPeriod = answeredPeriods?.[answeredPeriods.length - 1]

    if (newPeriodIndex < 0) {
      return
    }

    if (isEmpty(period)) {
      let message = errorMessages.periodsStartDateRequired
      let field = 'startDate'

      if (
        (!answeredPeriods &&
          application.answers.firstPeriodStart &&
          application.answers.firstPeriodStart !== 'specificDate') ||
        (lastAnsweredPeriod?.startDate !== undefined &&
          !lastAnsweredPeriod?.endDate)
      ) {
        field = 'endDate'
        message = errorMessages.periodsEndDateRequired
      }

      if (!lastAnsweredPeriod?.startDate) {
        return buildError(message, field)
      }
    }

    if (period?.startDate !== undefined) {
      const field = 'startDate'
      const { startDate } = period

      // We need a valid start date
      if (typeof startDate !== 'string' || !isValid(parseISO(startDate))) {
        return buildError(errorMessages.periodsStartDate, field)
      }

      // Start date can be up to 1 month before the expectedDateOfBirth
      if (
        parseISO(startDate).getTime() < subMonths(parseISO(dob), 1).getTime()
      ) {
        return buildError(errorMessages.periodsStartDateBeforeDob, field)
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(startDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(errorMessages.periodsPeriodRange, field, {
          usageMaxMonths,
        })
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
        return buildError(errorMessages.periodsStartDateOverlaps, field)
      }
    }

    // The user already has already set one or more periods, and is now adding another.
    // We check if the endDate of the new period is not undefined
    if (
      !period?.endDate &&
      period?.startDate === lastAnsweredPeriod?.startDate &&
      has(lastAnsweredPeriod, 'startDate') &&
      !has(lastAnsweredPeriod, 'endDate')
    ) {
      const field = 'endDate'
      return buildError(errorMessages.periodsEndDateRequired, field)
    }

    if (period?.endDate !== undefined) {
      const field = 'endDate'
      const { startDate, endDate } = period

      // We need a valid end date
      if (typeof endDate !== 'string' || !isValid(parseISO(endDate))) {
        return buildError(coreErrorMessages.defaultError, field)
      }

      // If the startDate is using the expected date of birth, we then calculate the minimum period required from the date of birth
      if (
        !startDate &&
        differenceInDays(parseISO(endDate), parseISO(dob)) < minPeriodDays
      ) {
        return buildError(errorMessages.periodsEndDate, field, {
          minPeriodDays,
        })
      }

      // We check if endDate is after startDate
      if (endDate < startDate) {
        return buildError(errorMessages.periodsEndDateBeforeStartDate, field)
      }

      // We check if the user selected at least the minimum period required
      if (
        differenceInDays(parseISO(endDate), parseISO(startDate)) < minPeriodDays
      ) {
        return buildError(errorMessages.periodsEndDateMinimumPeriod, field, {
          minPeriodDays,
        })
      }

      // We check if the start date is within the allowed period
      if (
        differenceInMonths(parseISO(endDate), parseISO(dob)) > usageMaxMonths
      ) {
        return buildError(errorMessages.periodsPeriodRange, field, {
          usageMaxMonths,
        })
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
        return buildError(errorMessages.periodsEndDateOverlapsPeriod, field)
      }
    }

    if (period?.ratio !== undefined) {
      const field = 'ratio'
      const { startDate, endDate, ratio } = period
      const diff = differenceInDays(parseISO(endDate), parseISO(startDate))
      const diffWithRatio = (diff * Number(ratio)) / 100

      // We want to make sure the ratio doesn't affect the minimum number of days selected
      if (diffWithRatio < minPeriodDays) {
        return buildError(errorMessages.periodsRatio, field, {
          minPeriodDays,
          diff,
          ratio,
          diffWithRatio,
        })
      }
    }

    return undefined
  },
}
