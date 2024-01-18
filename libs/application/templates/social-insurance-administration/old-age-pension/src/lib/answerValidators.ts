import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { period } from './answerValidationSections/period'

const { PERIOD } = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
}
