import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants, ChildPensionReason } from '../constants'
import { buildError } from './utils'
import { ChildPensionRow } from '../../types'

export const validateSelectedChildrenInCustodyReason = (newAnswer: unknown) => {
  const rawSelectedChildrenInCustody = newAnswer as
    | ChildPensionRow[]
    | undefined
  const { VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON } =
    AnswerValidationConstants

  if (!Array.isArray(rawSelectedChildrenInCustody)) {
    return buildError(
      validatorErrorMessages.registerChildNotAList,
      `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}`,
    )
  }

  for (const [i, child] of rawSelectedChildrenInCustody.entries()) {
    if (child.reason) {
      if (child.reason.length === 0) {
        return buildError(
          validatorErrorMessages.childPensionReason,
          `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}[${i}].reason`,
        )
      }

      if (child.reason.length > 2) {
        return buildError(
          validatorErrorMessages.childPensionMaxTwoReasons,
          `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}[${i}].reason`,
        )
      } else {
        if (
          child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
          child.reason.includes(ChildPensionReason.CHILD_IS_FATHERLESS)
        ) {
          return buildError(
            validatorErrorMessages.childPensionReasonsDoNotMatch,
            `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}[${i}].reason`,
          )
        }

        if (
          child.reason.includes(ChildPensionReason.PARENT_IS_DEAD) &&
          child.reason.includes(ChildPensionReason.PARENTS_PENITENTIARY)
        ) {
          return buildError(
            validatorErrorMessages.childPensionReasonsDoNotMatch,
            `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}[${i}].reason`,
          )
        }
      }
    }
  }

  return undefined
}
