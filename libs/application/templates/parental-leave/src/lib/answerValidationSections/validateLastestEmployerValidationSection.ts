import { EmployerRow } from '../../types'
import { errorMessages } from '../messages'
import { AnswerValidationError } from '@island.is/application/core'
import { buildError, ValidateField, validateFieldInDictionary } from './utils'
import { isValidEmail } from '../isValidEmail'
import isArray from 'lodash/isArray'
import { AnswerValidationConstants, PARENTAL_LEAVE, YES } from '../../constants'
import { Application } from '@island.is/application/types'
import { getApplicationAnswers } from '../parentalLeaveUtils'
const { EMPLOYERS } = AnswerValidationConstants

const validateEmployerRepeaterFields = (
  employers: EmployerRow[] | undefined,
): AnswerValidationError | undefined => {
  const periodDictionary = (employers as unknown) as Record<string, EmployerRow>
  const validations: ValidateField<EmployerRow>[] = [
    {
      fieldName: 'email',
      validationFn: (p) => !isValidEmail(p.email as string),
      message: errorMessages.employerEmail,
    },
    {
      fieldName: 'ratio',
      validationFn: (p) => !p.ratio,
      message: errorMessages.employersRatioMissing,
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
  } = getApplicationAnswers(application.answers)

  if (
    isSelfEmployed === YES ||
    isReceivingUnemploymentBenefits === YES ||
    applicationType !== PARENTAL_LEAVE
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

  let index = undefined
  employers.map((e, i) => {
    if (!e.ratio) {
      index = i
    }
  })
  if (index) {
    return buildError(
      errorMessages.employersRatioMissing,
      `employers[${index}].ratio`,
    )
  }

  const validationError = validateEmployerRepeaterFields(employers)
  if (validationError) {
    return validationError
  }

  return undefined
}
