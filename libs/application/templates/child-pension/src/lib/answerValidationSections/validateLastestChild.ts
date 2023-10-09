import { Application } from '@island.is/application/types'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants } from '../constants'
import { buildError, validateReason } from './utils'
import { ChildPensionRow } from '../../types'
import * as kennitala from 'kennitala'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import { getApplicationAnswers } from '../childPensionUtils'

export const validateLastestChild = (
  newAnswer: unknown,
  application: Application,
) => {
  const rawRegisterChildRow = newAnswer as ChildPensionRow[] | undefined
  const { VALIDATE_LATEST_CHILD } = AnswerValidationConstants

  const { selectedChildrenInCustody } = getApplicationAnswers(
    application.answers,
  )

  if (!Array.isArray(rawRegisterChildRow)) {
    return buildError(
      validatorErrorMessages.registerChildNotAList,
      `${VALIDATE_LATEST_CHILD}`,
    )
  }

  const i = rawRegisterChildRow.length - 1
  if (i < 0) {
    return undefined
  }
  const child = rawRegisterChildRow[i]

  if (child.childDoesNotHaveNationalId) {
    if (!child.nationalIdOrBirthDate) {
      return buildError(
        validatorErrorMessages.birthDateRequired,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }

    const finalMinDate = startOfYear(subYears(new Date(), 17))
    const selectedDate = new Date(child.nationalIdOrBirthDate)
    if (!(finalMinDate <= selectedDate)) {
      return buildError(
        validatorErrorMessages.registerChildChildMustBeUnder18,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (!child.name) {
      return buildError(
        validatorErrorMessages.nameRequired,
        `${VALIDATE_LATEST_CHILD}[${i}].name`,
      )
    }
  } else {
    if (!child.nationalIdOrBirthDate) {
      return buildError(
        validatorErrorMessages.nationalIdRequired,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      rawRegisterChildRow.findIndex(
        (item) => item.nationalIdOrBirthDate === child.nationalIdOrBirthDate,
      ) !== i
    ) {
      return buildError(
        validatorErrorMessages.nationalIdDuplicate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      selectedChildrenInCustody.findIndex(
        (item) =>
          kennitala.format(item.nationalIdOrBirthDate) ===
          child.nationalIdOrBirthDate,
      ) !== -1
    ) {
      return buildError(
        validatorErrorMessages.nationalIdDuplicate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      child.nationalIdOrBirthDate.length !== 0 &&
      kennitala.isValid(child.nationalIdOrBirthDate) &&
      kennitala.isPerson(child.nationalIdOrBirthDate)
    ) {
      if (kennitala.info(child.nationalIdOrBirthDate).age >= 18) {
        return buildError(
          validatorErrorMessages.registerChildChildMustBeUnder18,
          `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
        )
      }
    } else {
      return buildError(
        validatorErrorMessages.nationalIdMustBeValid,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
  }

  // Reason
  const validatedField = validateReason(
    child,
    `${VALIDATE_LATEST_CHILD}[${i}]`,
    application,
  )

  if (validatedField !== undefined) {
    return validatedField
  }

  return undefined
}
