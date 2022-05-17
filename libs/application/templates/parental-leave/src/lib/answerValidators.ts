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

import { Period, Payments } from '../types'
import { NO, NO_PRIVATE_PENSION_FUND, NO_UNION, YES } from '../constants'
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
const PAYMENTS = 'payments'
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
  [PAYMENTS]: (newAnswer: unknown, application: Application) => {
    const payments = newAnswer as Payments

    const privatePensionFund = getValueViaPath(
      application.answers,
      'payments.privatePensionFund',
    )

    const privatePensionFundPercentage = getValueViaPath(
      application.answers,
      'payments.privatePensionFundPercentage',
    )

    const usePrivatePensionFund = getValueViaPath(
      application.answers,
      'usePrivatePensionFund',
    )

    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${PAYMENTS}.${path}`)(message)

    if (payments.union !== NO_UNION) {
      if (payments.union === '') {
        return buildError(coreErrorMessages.defaultError, 'union')
      }
    }

    // if privatePensionFund is NO_PRIVATE_PENSION_FUND and privatePensionFundPercentage is an empty string, allow the user to continue.
    // this will only happen when the usePrivatePensionFund field is set to NO
    if (
      payments.privatePensionFund === NO_PRIVATE_PENSION_FUND &&
      payments.privatePensionFundPercentage === '0'
    )
      return undefined

    if (usePrivatePensionFund === NO || usePrivatePensionFund === YES) {
      if (payments.privatePensionFund === '') {
        return buildError(coreErrorMessages.defaultError, 'privatePensionFund')
      }
      if (payments.privatePensionFundPercentage === '') {
        return buildError(
          coreErrorMessages.defaultError,
          'privatePensionFundPercentage',
        )
      }
    }

    if (
      payments.privatePensionFund === '' ||
      payments.privatePensionFund === NO_PRIVATE_PENSION_FUND
    ) {
      return buildError(coreErrorMessages.defaultError, 'privatePensionFund')
    }

    // This case will only happen if the users has first selected NO
    // and then goes back and changes to YES without filling in data for pritvatePensionFundPercentage
    if (
      privatePensionFund === NO_PRIVATE_PENSION_FUND &&
      privatePensionFundPercentage === '0' &&
      payments.privatePensionFundPercentage === ''
    ) {
      return buildError(
        coreErrorMessages.defaultError,
        'privatePensionFundPercentage',
      )
    }

    if (
      payments.privatePensionFundPercentage !== '2' &&
      payments.privatePensionFundPercentage !== '4'
    ) {
      if (usePrivatePensionFund === NO) return undefined
      return buildError(
        coreErrorMessages.defaultError,
        'privatePensionFundPercentage',
      )
    }

    // validate that the privatePensionFundPercentage is either 2 or 4 percent
    if (
      payments.privatePensionFundPercentage === '2' ||
      payments.privatePensionFundPercentage === '4'
    ) {
      return undefined
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

    let daysUsedByPeriods, rights

    try {
      daysUsedByPeriods = calculateDaysUsedByPeriods(periods)
      rights = getAvailableRightsInDays(application)
    } catch (e) {
      return {
        path: 'periods',
        message: e,
        values: {},
      }
    }

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
