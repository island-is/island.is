import { AnswerValidator } from '@island.is/application/core'
import { AnswerValidationConstants } from '../shared/constants'
import { vehiclesList } from './answerValidationSections/vehicleList'

const { VEHICLES_LIST } = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [VEHICLES_LIST]: vehiclesList,
}
