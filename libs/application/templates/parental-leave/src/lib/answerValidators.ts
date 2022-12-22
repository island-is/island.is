import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'

import {
  AnswerValidator,
  getValueViaPath,
  buildValidationError,
  coreErrorMessages,
  AnswerValidationError,
} from '@island.is/application/core'
import {
  Application,
  Answer,
  StaticText,
  StaticTextObject,
} from '@island.is/application/types'

import {
  Period,
  Payments,
  OtherParentObj,
  MultipleBirths,
  RequestRightsObj,
  GiveRightsObj,
} from '../types'
import {
  MANUAL,
  NO,
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  ParentalRelations,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  SINGLE,
  UnEmployedBenefitTypes,
  YES,
} from '../constants'
import { isValidEmail } from './isValidEmail'
import { errorMessages } from './messages'
import {
  getExpectedDateOfBirth,
  calculateDaysUsedByPeriods,
  getAvailableRightsInDays,
  getApplicationAnswers,
  getMaxMultipleBirthsDays,
  getSelectedChild,
} from './parentalLeaveUtils'
import { filterValidPeriods } from '../lib/parentalLeaveUtils'
import { validatePeriod } from './answerValidator-utils'
import { defaultMultipleBirthsMonths } from '../config'

const EMPLOYER = 'employer'
const FILEUPLOAD = 'fileUpload'
const PAYMENTS = 'payments'
const OTHER_PARENT = 'otherParentObj'
const REQUEST_RIGHTS = 'requestRights'
const GIVE_RIGHTS = 'giveRights'
// Check Multiple_Births
const MULTIPLE_BIRTHS = 'multipleBirths'
const OTHER_PARENT_EMAIL = 'otherParentEmail'
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

    const { isSelfEmployed } = getApplicationAnswers(application.answers)

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

    if (obj.isSelfEmployed === '' || !obj.isSelfEmployed) {
      if (isSelfEmployed) {
        return undefined
      }
      return buildError(coreErrorMessages.defaultError, 'isSelfEmployed')
    }

    return undefined
  },
  [FILEUPLOAD]: (newAnswer: unknown, application: Application) => {
    const obj = newAnswer as Record<string, Answer>

    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${FILEUPLOAD}.${path}`)(message)

    const {
      isSelfEmployed,
      applicationType,
      isRecivingUnemploymentBenefits,
      unemploymentBenefits,
      otherParent,
    } = getApplicationAnswers(application.answers)
    if (isSelfEmployed === YES && obj.selfEmployedFile) {
      if (isEmpty((obj as { selfEmployedFile: unknown[] }).selfEmployedFile))
        return buildError(errorMessages.requiredAttachment, 'selfEmployedFile')

      return undefined
    }

    if (applicationType === PARENTAL_GRANT_STUDENTS && obj.studentFile) {
      if (isEmpty((obj as { studentFile: unknown[] }).studentFile))
        return buildError(errorMessages.requiredAttachment, 'studentFile')
      return undefined
    }

    if (otherParent === SINGLE && obj.singleParent) {
      if (isEmpty((obj as { singleParent: unknown[] }).singleParent))
        return buildError(errorMessages.requiredAttachment, 'singleParent')

      return undefined
    }

    if (isRecivingUnemploymentBenefits) {
      if (
        (unemploymentBenefits === UnEmployedBenefitTypes.union ||
          unemploymentBenefits === UnEmployedBenefitTypes.healthInsurance) &&
        obj.benefitsFile
      ) {
        if (isEmpty((obj as { benefitsFile: unknown[] }).benefitsFile))
          return buildError(errorMessages.requiredAttachment, 'benefitsFile')

        return undefined
      }
    }

    return undefined
  },
  [MULTIPLE_BIRTHS]: (newAnswer: unknown) => {
    const obj = newAnswer as MultipleBirths

    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${path}`)(message)

    if (obj.hasMultipleBirths === YES) {
      if (!obj.multipleBirths) {
        return buildError(
          errorMessages.missingMultipleBirthsAnswer,
          'multipleBirths',
        )
      }
      if (obj.multipleBirths < 2) {
        return buildError(
          errorMessages.tooFewMultipleBirthsAnswer,
          'multipleBirths',
        )
      }
      if (obj.multipleBirths > defaultMultipleBirthsMonths + 1) {
        return buildError(
          errorMessages.tooManyMultipleBirthsAnswer,
          'multipleBirths',
        )
      }
    }
    return undefined
  },
  [OTHER_PARENT_EMAIL]: (newAnswer: unknown, application: Application) => {
    const email = newAnswer as string
    const { otherParent } = getApplicationAnswers(application.answers)
    const hasOtherParent = otherParent !== NO && otherParent !== SINGLE
    if (hasOtherParent && !isValidEmail(email)) {
      return buildValidationError(OTHER_PARENT_EMAIL)(errorMessages.email)
    }
  },
  [OTHER_PARENT]: (newAnswer: unknown) => {
    const otherParentObj = newAnswer as OtherParentObj

    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${OTHER_PARENT}.${path}`)(message)

    // If manual option is chosen then user have to insert name and national id
    if (otherParentObj.chooseOtherParent === MANUAL) {
      if (isEmpty(otherParentObj.otherParentId))
        return buildError(coreErrorMessages.missingAnswer, 'otherParentId')
    }

    return undefined
  },
  [REQUEST_RIGHTS]: (newAnswer: unknown, application: Application) => {
    const requestRightsObj = newAnswer as RequestRightsObj
    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${path}`)(message)

    const {
      multipleBirthsRequestDays,
      hasMultipleBirths,
    } = getApplicationAnswers(application.answers)
    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )

    if (
      requestRightsObj.isRequestingRights === YES &&
      hasMultipleBirths === YES &&
      multipleBirthsRequestDays * 1 !==
        getMaxMultipleBirthsDays(application.answers) &&
      selectedChild?.parentalRelation === ParentalRelations.primary
    ) {
      return buildError(
        errorMessages.notAllowedToRequestRights,
        'transferRights',
      )
    }

    return undefined
  },
  [GIVE_RIGHTS]: (newAnswer: unknown, application: Application) => {
    const givingRightsObj = newAnswer as GiveRightsObj
    const buildError = (message: StaticText, path: string) =>
      buildValidationError(`${path}`)(message)

    const {
      multipleBirthsRequestDays,
      hasMultipleBirths,
    } = getApplicationAnswers(application.answers)

    const selectedChild = getSelectedChild(
      application.answers,
      application.externalData,
    )
    if (
      givingRightsObj.isGivingRights === YES &&
      hasMultipleBirths === YES &&
      multipleBirthsRequestDays * 1 !== 0 &&
      selectedChild?.parentalRelation === ParentalRelations.primary
    ) {
      return buildError(errorMessages.notAllowedToGiveRights, 'transferRights')
    }

    return undefined
  },
  [PAYMENTS]: (newAnswer: unknown, application: Application) => {
    const payments = newAnswer as Payments

    const {
      applicationType,
      privatePensionFund,
      privatePensionFundPercentage,
      usePrivatePensionFund,
    } = getApplicationAnswers(application.answers)

    if (applicationType === PARENTAL_LEAVE) {
      const buildError = (message: StaticText, path: string) =>
        buildValidationError(`${PAYMENTS}.${path}`)(message)

      if (!payments.pensionFund) {
        return buildError(coreErrorMessages.defaultError, 'pensionFund')
      }

      if (payments.union !== NO_UNION) {
        if (payments.union === '') {
          return buildError(coreErrorMessages.defaultError, 'union')
        }
      }

      // if privatePensionFund is NO_PRIVATE_PENSION_FUND and privatePensionFundPercentage is an empty string, allow the user to continue.
      // this will only happen when the usePrivatePensionFund field is set to NO
      if (
        payments.privatePensionFund === NO_PRIVATE_PENSION_FUND &&
        (payments.privatePensionFundPercentage === '0' ||
          payments.privatePensionFundPercentage === undefined)
      )
        return undefined

      if (usePrivatePensionFund === NO || usePrivatePensionFund === YES) {
        if (payments.privatePensionFund === '') {
          return buildError(
            coreErrorMessages.defaultError,
            'privatePensionFund',
          )
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
    }

    return undefined
  },
  [VALIDATE_LATEST_PERIOD]: (newAnswer: unknown, application: Application) => {
    let periods = newAnswer as Period[] | undefined
    // If added new a period, sometime the old periods in newAnswer are 'null'
    // If that happen, take the periods in application and use them
    const filterPeriods = periods?.filter(
      (period) => !!period?.startDate || !!period?.firstPeriodStart,
    )
    if (filterPeriods?.length !== periods?.length) {
      periods = getValueViaPath(application.answers, 'periods')
      periods = periods?.filter((period) => !!period?.startDate)
    }
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
    // const periods = newAnswer as Period[]
    const { periods } = getApplicationAnswers(application.answers)

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
