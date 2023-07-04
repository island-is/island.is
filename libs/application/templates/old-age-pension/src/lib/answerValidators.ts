import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpploadPenEarlyFisher } from './answerValidationSections/fileUpploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHomeAllowance } from './answerValidationSections/fileUploadHomeAllowance'
import { fileUploadChildPension } from './answerValidationSections/fileUploadChildPension'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOMEALLOWANCE,
  FILEUPLOADCHILDPENSION,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [FILEUPLOADPENEARLYFISHER]: fileUpploadPenEarlyFisher,
  [FILEUPLOADHOMEALLOWANCE]: fileUploadHomeAllowance,
  [FILEUPLOADCHILDPENSION]: fileUploadChildPension,
}
