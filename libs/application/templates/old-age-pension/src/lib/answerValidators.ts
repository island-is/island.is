import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpploadPenEarlyFisher } from './answerValidationSections/fileUpploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHomeAllowance } from './answerValidationSections/fileUploadHomeAllowance'
import { employer } from './answerValidationSections/employer'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOMEALLOWANCE,
  EMPLOYER,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [EMPLOYER]: employer,
  [FILEUPLOADPENEARLYFISHER]: fileUpploadPenEarlyFisher,
  [FILEUPLOADHOMEALLOWANCE]: fileUploadHomeAllowance,
}
