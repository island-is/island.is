import { EmployerRow } from '../../types'
import { errorMessages } from '../messages'
import { AnswerValidationError } from '@island.is/application/core'
import { buildError, ValidateField, validateFieldInDictionary } from './utils'
import { isValidEmail } from '../isValidEmail'
import isArray from 'lodash/isArray'
import {
  AnswerValidationConstants,
  NO,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  YES,
} from '../../constants'
import { Application } from '@island.is/application/types'
import { getApplicationAnswers } from '../parentalLeaveUtils'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
const { EMPLOYERS } = AnswerValidationConstants

const validateEmployerRepeaterFields = (
  employers: EmployerRow[] | undefined,
): AnswerValidationError | undefined => {
  const periodDictionary = employers as unknown as Record<string, EmployerRow>

  const verfifyPhoneNumber = (e: string | undefined) => {
    if (e) {
      const phoneNumber = parsePhoneNumberFromString(e, 'IS')
      const phoneNumberStartStr = ['6', '7', '8']
      if (phoneNumber) {
        if (
          !(
            phoneNumber.isValid() &&
            phoneNumberStartStr.some((substr) =>
              phoneNumber.nationalNumber.startsWith(substr),
            )
          )
        ) {
          return true
        }
      }
    }
    return false
  }

  const validations: ValidateField<EmployerRow>[] = [
    {
      fieldName: 'email',
      validationFn: (p) => !isValidEmail(p.email as string),
      message: errorMessages.employerEmail,
    },
    {
      fieldName: 'phoneNumber',
      validationFn: (p) => verfifyPhoneNumber(p?.phoneNumber),
      message: errorMessages.GSMPhoneNumber,
    },
  ]

  for (const { fieldName, validationFn, message } of validations) {
    const result = validateFieldInDictionary(
      periodDictionary,
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

export const validateLatestEmployerValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const employers = newAnswer as EmployerRow[] | undefined
  const {
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    applicationType,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  if (
    isSelfEmployed === YES ||
    isReceivingUnemploymentBenefits === YES ||
    ((applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
      employerLastSixMonths === NO)
  ) {
    return undefined
  }

  if (!isArray(employers)) {
    return buildError(errorMessages.employersNotAList, 'employers', EMPLOYERS)
  }

  if (employers?.length === 0) {
    // Nothing to validate
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-inferrable-types */
  let ratioIndex: number = -1
  employers?.map((e, i) => {
    if (!e.ratio) {
      ratioIndex = i
      return
    }
  })
  if (ratioIndex >= 0) {
    return buildError(
      errorMessages.employersRatioMissing,
      `employers[${ratioIndex}].ratio`,
    )
  }

  const validationError = validateEmployerRepeaterFields(employers)
  if (validationError) {
    return validationError
  }

  if (
    (applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
    employerLastSixMonths === YES
  ) {
    /* eslint-disable-next-line @typescript-eslint/no-inferrable-types */
    let stillEmployedIndex: number = -1
    employers?.map((e, i) => {
      if (!e.stillEmployed) {
        stillEmployedIndex = i
        return
      }
    })
    if (stillEmployedIndex >= 0) {
      return buildError(
        errorMessages.employersStillEmployedMissing,
        `employers[${stillEmployedIndex}].stillEmployed`,
      )
    }
  }

  return undefined
}
