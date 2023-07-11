import { Application } from '@island.is/application/types'
import { AnswerValidationError } from '@island.is/application/core'

import { isArray } from 'lodash'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { validatorErrorMessages } from '../messages'
import {
  AnswerValidationConstants,
  employeeRatio,
  RatioType,
} from '../constants'
import { buildError, ValidateField, validateFieldInDictionary } from './utils'
import { Employer } from '../../types'

const validatePeriodRepeaterFields = (
  employers: Employer[] | undefined,
): AnswerValidationError | undefined => {
  const employerDictionary = (employers as unknown) as Record<string, Employer>
  const validations: ValidateField<Employer>[] = [
    {
      fieldName: 'email',
      validationFn: (e) => !e.email,
      message: validatorErrorMessages.employerEmailMissing,
    },
    {
      fieldName: 'ratioType',
      validationFn: (e) =>
        !e.ratioType ||
        ![RatioType.MONTHLY, RatioType.YEARLY].includes(e.ratioType),
      message: validatorErrorMessages.employerRatioTypeMissing,
    },
  ]

  for (const { fieldName, validationFn, message } of validations) {
    const result = validateFieldInDictionary(
      employerDictionary,
      'employers',
      fieldName,
      validationFn,
      message,
    )
    if (result) {
      return result
    }
  }
}

export const employers = (newAnswer: unknown, application: Application) => {
  const rawEmployers = newAnswer as Employer[] | undefined
  const { EMPLOYERS } = AnswerValidationConstants

  const validationError = validatePeriodRepeaterFields(rawEmployers)
  if (validationError) {
    return validationError
  }

  if (!isArray(rawEmployers)) {
    return buildError(validatorErrorMessages.employersNotAList, `${EMPLOYERS}`)
  }

  for (const { i, e } of rawEmployers.map((e, i) => ({ i, e }))) {
    if (
      e.email &&
      rawEmployers.findIndex((item) => item.email === e.email) !== i
    ) {
      return buildError(
        validatorErrorMessages.employerEmailDuplicate,
        `${EMPLOYERS}[${i}].email`,
      )
    }

    if (e.phoneNumber) {
      const phoneNumber = parsePhoneNumberFromString(e.phoneNumber, 'IS')
      const phoneNumberStartStr = ['6', '7', '8']
      const checkPhoneNumber =
        phoneNumber &&
        phoneNumber.isValid() &&
        phoneNumberStartStr.some((substr) =>
          phoneNumber.nationalNumber.startsWith(substr),
        )
      if (!checkPhoneNumber) {
        return buildError(
          validatorErrorMessages.employersPhoneNumberInvalid,
          `${EMPLOYERS}[${i}].phoneNumber`,
        )
      }
    }

    if (e.ratioType === RatioType.YEARLY) {
      if (!e.ratioYearly) {
        return buildError(
          validatorErrorMessages.employerRatioMissing,
          `${EMPLOYERS}[${i}].ratioYearly`,
        )
      }

      const employeeRate = +e.ratioYearly.replace('%', '')
      if (employeeRate > employeeRatio) {
        return buildError(
          validatorErrorMessages.employersRatioMoreThan50,
          `${EMPLOYERS}[${i}].ratioYearly`,
        )
      }
      if (employeeRate <= 0) {
        return buildError(
          validatorErrorMessages.employersRatioLessThan0,
          `${EMPLOYERS}[${i}].ratioYearly`,
        )
      }
    }

    if (e.ratioType === RatioType.MONTHLY) {
      if (!e.ratioMonthlyAvg) {
        return buildError(
          validatorErrorMessages.employerRatioMissing,
          `${EMPLOYERS}[${i}].ratioMonthlyAvg`,
        )
      }

      const employeeRate = +e.ratioMonthlyAvg.replace('%', '')
      if (employeeRate > employeeRatio) {
        return buildError(
          validatorErrorMessages.employersRatioMoreThan50,
          `${EMPLOYERS}[${i}].ratioMonthlyAvg`,
        )
      }
      if (employeeRate <= 0) {
        return buildError(
          validatorErrorMessages.employersRatioLessThan0,
          `${EMPLOYERS}[${i}].ratioMonthlyAvg`,
        )
      }
    }
  }

  return undefined
}
