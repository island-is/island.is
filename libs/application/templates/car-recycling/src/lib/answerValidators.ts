import { AnswerValidator } from '@island.is/application/core'
import { AnswerValidationConstants } from '../shared/constants'
import { vehicles } from './answerValidationSections/vehicles'

const { VEHICLES } = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [VEHICLES]: vehicles,
}
