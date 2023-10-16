import { Application } from '@island.is/application/types'
import { buildValidationError } from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'
import { validatorErrorMessages } from '../messages'
import { ChildPensionReason } from '../constants'
import { ChildPensionRow } from '../../types'
import * as kennitala from 'kennitala'
import { getApplicationExternalData } from '../childPensionUtils'

export const buildError = (message: StaticText, path: string) =>
  buildValidationError(`${path}`)(message)

export const validateReason = (
  child: ChildPensionRow,
  path: string,
  application: Application,
) => {
  if (!child.reason || child.reason.length === 0) {
    return buildError(
      validatorErrorMessages.childPensionReason,
      `${path}.reason`,
    )
  }

  if (child.reason.length > 2) {
    return buildError(
      validatorErrorMessages.childPensionMaxTwoReasons,
      `${path}.reason`,
    )
  } else {
    if (
      child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
      child.reason.includes(ChildPensionReason.CHILD_IS_FATHERLESS)
    ) {
      return buildError(
        validatorErrorMessages.childPensionReasonsDoNotMatch,
        `${path}.reason`,
      )
    }

    if (
      child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
      child.reason.includes(ChildPensionReason.PARENTS_PENITENTIARY)
    ) {
      return buildError(
        validatorErrorMessages.childPensionReasonsDoNotMatch,
        `${path}.reason`,
      )
    }
  }

  // Parent is dead
  if (child.reason.includes(ChildPensionReason.PARENT_IS_DEAD)) {
    if (child.parentIsDead) {
      for (const [index, parent] of child.parentIsDead.entries()) {
        if (parent.parentDoesNotHaveNationalId) {
          if (!parent.nationalIdOrBirthDate) {
            return buildError(
              validatorErrorMessages.birthDateRequired,
              `${path}.parentIsDead[${index}].nationalIdOrBirthDate`,
            )
          }
          if (!parent.name) {
            return buildError(
              validatorErrorMessages.nameRequired,
              `${path}.parentIsDead[${index}].name`,
            )
          }
        } else {
          if (!parent.nationalIdOrBirthDate) {
            return buildError(
              validatorErrorMessages.nationalIdRequired,
              `${path}.parentIsDead[${index}].nationalIdOrBirthDate`,
            )
          }
          if (
            !(
              parent.nationalIdOrBirthDate.length !== 0 &&
              kennitala.isValid(parent.nationalIdOrBirthDate) &&
              kennitala.isPerson(parent.nationalIdOrBirthDate)
            )
          ) {
            return buildError(
              validatorErrorMessages.nationalIdMustBeValid,
              `${path}.parentIsDead[${index}].nationalIdOrBirthDate`,
            )
          }
        }
      }

      if (child.parentIsDead.length === 2) {
        if (
          child.parentIsDead.every(
            (parent) => !parent.parentDoesNotHaveNationalId,
          )
        ) {
          if (
            child.parentIsDead[0].nationalIdOrBirthDate ===
            child.parentIsDead[1].nationalIdOrBirthDate
          ) {
            return buildError(
              validatorErrorMessages.nationalIdDuplicate,
              `${path}.parentIsDead[${1}].nationalIdOrBirthDate`,
            )
          }
        }
      }
    }
  }

  // Parents penitentiary
  if (child.reason.includes(ChildPensionReason.PARENTS_PENITENTIARY)) {
    const { hasSpouse } = getApplicationExternalData(application.externalData)

    if (!hasSpouse) {
      return buildError('', `${path}.reason`)
    }
  }
}
