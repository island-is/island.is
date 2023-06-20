import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpploadPenEarlyFisher } from './answerValidationSections/fileUpploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHomeAllowance } from './answerValidationSections/fileUploadHomeAllowance'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOMEALLOWANCE,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [FILEUPLOADPENEARLYFISHER]: fileUpploadPenEarlyFisher,
  [FILEUPLOADHOMEALLOWANCE]: fileUploadHomeAllowance,
}
