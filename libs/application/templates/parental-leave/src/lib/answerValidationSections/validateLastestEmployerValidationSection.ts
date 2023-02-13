import { EmployerRow } from '../../types'
import { errorMessages } from '../messages'
import { AnswerValidationError } from '@island.is/application/core'
import { buildError, ValidateField, validateFieldInDictionary } from './utils'
import { isValidEmail } from '../isValidEmail'
import { isArray } from 'lodash'
import { AnswerValidationConstants } from '../../constants'
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

export const validateLatestEmployerValidationSection = (newAnswer: unknown) => {
  const employers = newAnswer as EmployerRow[] | undefined

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
