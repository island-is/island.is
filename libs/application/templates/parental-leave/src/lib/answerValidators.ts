import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import differenceInMonths from 'date-fns/differenceInMonths'
import isWithinInterval from 'date-fns/isWithinInterval'
import subMonths from 'date-fns/subMonths'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
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
  calculateDaysUsedByPeriods,
  getAvailableRightsInDays,
} from './parentalLeaveUtils'
import { filterValidPeriods } from '../lib/parentalLeaveUtils'
import { validatePeriod } from './answerValidator-utils'

const EMPLOYER = 'employer'
const FIRST_PERIOD_START = 'firstPeriodStart'
// When attempting to continue from the periods repeater main screen
// this validator will get called to validate all of the periods
export const VALIDATE_PERIODS = 'validatedPeriods'
// When a new entry is added to the periods repeater
// the repeater sends all the periods saved in 'periods'
// to this validator, which will validate the latest one
export const VALIDATE_LATEST_PERIOD = 'periods'

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
  [VALIDATE_LATEST_PERIOD]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]

    if (!isArray(periods)) {
      return {
        path: 'periods',
        message: 'Svar þarf að vera listi af tímabilum',
      }
    }

    if (periods?.length === 0) {
      // Nothing to validate
      return undefined
    }

    const latestPeriodIndex = periods.length - 1
    const latestPeriod = periods[latestPeriodIndex]
    const expectedDateOfBirth = getExpectedDateOfBirth(application)

    if (!expectedDateOfBirth) {
      return {
        path: 'periods',
        message: 'Áætlaðan fæðingardag vantar í umsókn',
      }
    }

    const { periods: existingPeriods } = getApplicationAnswers(
      application.answers,
    )

    const isFirstPeriod = existingPeriods.length === 0

    const buildError = buildValidationError(
      VALIDATE_LATEST_PERIOD,
      latestPeriodIndex,
    )

    const buildFieldError = (
      field: string | null,
      message: string,
      values: Record<string, unknown> | undefined = undefined,
    ) => {
      if (field !== null) {
        return buildError(message, field, values)
      }

      return {
        path: VALIDATE_LATEST_PERIOD,
        message,
        values,
      }
    }

    const validatedField = validatePeriod(
      latestPeriod,
      isFirstPeriod,
      existingPeriods,
      application,
      buildFieldError,
    )

    if (validatedField !== undefined) {
      return validatedField
    }

    return undefined
  },
  [VALIDATE_PERIODS]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]

    if (periods.length === 0) {
      return {
        path: 'periods',
        message: 'Þú þarft að velja tímabil',
      }
    }

    const newPeriodIndex = periods.length - 1
    const period = periods[newPeriodIndex]
    const buildError = buildValidationError(VALIDATE_PERIODS, newPeriodIndex)
    const expectedDateOfBirth = getExpectedDateOfBirth(application)
    const dob = expectedDateOfBirth as string
    const { periods: answeredPeriods } = getApplicationAnswers(
      application.answers,
    )

    // TODO: best to make requests to VMST to calculate period length again
    // based on start, end + ratio in the case of a handcrafted update request
    const daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
    const rights = getAvailableRightsInDays(application)

    if (daysUsedByPeriods > rights) {
      return {
        path: 'periods',
        message: `Valin tímabil fara yfir réttindi (${daysUsedByPeriods} > ${rights} dagar)`,
      }
    }

    return undefined
  },
}
