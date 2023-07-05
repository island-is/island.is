import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpploadPenEarlyFisher } from './answerValidationSections/fileUpploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHomeAllowance } from './answerValidationSections/fileUploadHomeAllowance'
import { employment } from './answerValidationSections/employment'
import { employers } from './answerValidationSections/employers'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOMEALLOWANCE,
  EMPLOYMENT,
  EMPLOYERS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [EMPLOYMENT]: employment,
  [EMPLOYERS]: employers,
  [FILEUPLOADPENEARLYFISHER]: fileUpploadPenEarlyFisher,
  [FILEUPLOADHOMEALLOWANCE]: fileUploadHomeAllowance,
}
