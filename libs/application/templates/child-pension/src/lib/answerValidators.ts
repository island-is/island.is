import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { validateLastestChild } from './answerValidationSections/validateLastestChild'

const { VALIDATE_LATEST_CHILD } = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [VALIDATE_LATEST_CHILD]: validateLastestChild,
}
