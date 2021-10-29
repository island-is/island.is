import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'

import {
  Application,
  AnswerValidator,
  getValueViaPath,
  Answer,
  buildValidationError,
  coreErrorMessages,
  StaticText,
  StaticTextObject,
  AnswerValidationError,
} from '@island.is/application/core'

import { Period } from '../types'
import { NO, YES } from '../constants'
import { isValidEmail } from './isValidEmail'
import { errorMessages } from './messages'
import {
  getExpectedDateOfBirth,
  calculateDaysUsedByPeriods,
  getAvailableRightsInDays,
} from './parentalLeaveUtils'
import { filterValidPeriods } from '../lib/parentalLeaveUtils'
import { validatePeriod } from './answerValidator-utils'

const EMPLOYER = 'employer'
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
      isEmpty((obj.selfEmployed as { file: unknown[] }).file)
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
  [VALIDATE_LATEST_PERIOD]: (newAnswer: unknown, application: Application) => {
    const periods = newAnswer as Period[]

    if (!isArray(periods)) {
      return {
        path: 'periods',
        message: errorMessages.periodsNotAList,
      }
    }

    if (periods?.length === 0) {
      // Nothing to validate
      return undefined
    }

    const daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
    const rights = getAvailableRightsInDays(application)

    if (daysUsedByPeriods > rights) {
      return {
        path: 'periods',
        message: errorMessages.periodsExceedRights,
        values: {
          daysUsedByPeriods,
          rights,
        },
      }
    }

    const latestPeriodIndex = periods.length - 1
    const latestPeriod = periods[latestPeriodIndex]
    const expectedDateOfBirth = getExpectedDateOfBirth(application)

    if (!expectedDateOfBirth) {
      return {
        path: 'periods',
        message: errorMessages.dateOfBirth,
      }
    }

    const otherPeriods = periods.slice(0, latestPeriodIndex)
    const validOtherPeriods = filterValidPeriods(otherPeriods)

    const isFirstPeriod = validOtherPeriods.length === 0

    const buildError = buildValidationError(
      VALIDATE_LATEST_PERIOD,
      latestPeriodIndex,
    )

    const buildFieldError = (
      field: string | null,
      message: StaticTextObject,
      values: Record<string, unknown> = {},
    ): AnswerValidationError => {
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
      validOtherPeriods,
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
        message: errorMessages.periodsEmpty,
      }
    }

    const daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
    const rights = getAvailableRightsInDays(application)

    if (daysUsedByPeriods > rights) {
      return {
        path: 'periods',
        message: errorMessages.periodsExceedRights,
        values: {
          daysUsedByPeriods,
          rights,
        },
      }
    }

    return undefined
  },
}
