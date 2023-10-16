import { Application } from '@island.is/application/types'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants } from '../constants'
import { buildError, validateReason } from './utils'
import { ChildPensionRow } from '../../types'

export const validateSelectedChildrenInCustodyReason = (
  newAnswer: unknown,
  application: Application,
) => {
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
      const validatedField = validateReason(
        child,
        `${VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON}[${i}]`,
        application,
      )

      if (validatedField !== undefined) {
        return validatedField
      }
    }
  }

  return undefined
}
