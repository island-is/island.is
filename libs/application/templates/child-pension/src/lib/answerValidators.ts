import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { validateLastestChild } from './answerValidationSections/validateLastestChild'
import { validateSelectedChildrenInCustodyReason } from './answerValidationSections/validateSelectedChildrenInCustodyReason'

const { VALIDATE_LATEST_CHILD, VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON } =
  AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [VALIDATE_LATEST_CHILD]: validateLastestChild,
  [VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON]:
    validateSelectedChildrenInCustodyReason,
}
