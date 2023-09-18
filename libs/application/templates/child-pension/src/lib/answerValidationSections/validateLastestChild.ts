import { Application } from '@island.is/application/types'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants, ChildPensionReason } from '../constants'
import { buildError } from './utils'
import { ChildPensionRow } from '../../types'
import * as kennitala from 'kennitala'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import { getApplicationExternalData } from '../childPensionUtils'

export const validateLastestChild = (
  newAnswer: unknown,
  application: Application,
) => {
  const rawRegisterChildRow = newAnswer as ChildPensionRow[] | undefined
  const { VALIDATE_LATEST_CHILD } = AnswerValidationConstants

  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
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
        validatorErrorMessages.childBirthDate,
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
        validatorErrorMessages.childName,
        `${VALIDATE_LATEST_CHILD}[${i}].name`,
      )
    }
  } else {
    if (!child.nationalIdOrBirthDate) {
      return buildError(
        validatorErrorMessages.childNationalId,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      rawRegisterChildRow.findIndex(
        (item) => item.nationalIdOrBirthDate === child.nationalIdOrBirthDate,
      ) !== i
    ) {
      return buildError(
        validatorErrorMessages.childNationalIdDuplicate,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
    if (
      custodyInformation.findIndex(
        (item) =>
          kennitala.format(item.nationalId) === child.nationalIdOrBirthDate,
      ) !== -1
    ) {
      return buildError(
        validatorErrorMessages.childNationalIdDuplicate,
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
        validatorErrorMessages.childNationalIdMustBeValid,
        `${VALIDATE_LATEST_CHILD}[${i}].nationalIdOrBirthDate`,
      )
    }
  }

  console.log('=======> (VALIDATION) child: ', child)
  if (!child.reason || child.reason.length === 0) {
    return buildError(
      validatorErrorMessages.childPensionReason,
      `${VALIDATE_LATEST_CHILD}[${i}].reason`,
    )
  }

  if (child.reason.length > 2) {
    return buildError(
      validatorErrorMessages.childPensionMaxTwoReasons,
      `${VALIDATE_LATEST_CHILD}[${i}].reason`,
    )
  } else {
    if (
      child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
      child.reason.includes(ChildPensionReason.CHILD_IS_FATHERLESS)
    ) {
      return buildError(
        validatorErrorMessages.childPensionReasonsDoNotMatch,
        `${VALIDATE_LATEST_CHILD}[${i}].reason`,
      )
    }

    if (
      child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
      child.reason.includes(ChildPensionReason.PARENTS_PENITENTIARY)
    ) {
      return buildError(
        validatorErrorMessages.childPensionReasonsDoNotMatch,
        `${VALIDATE_LATEST_CHILD}[${i}].reason`,
      )
    }
  }

  return undefined
}
