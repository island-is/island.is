import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpploadPenEarlyFisher } from './answerValidationSections/fileUpploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHouseholdSupplement } from './answerValidationSections/fileUploadHouseholdSupplement'
import { employment } from './answerValidationSections/employment'
import { employers } from './answerValidationSections/employers'
import { fileUploadChildPension } from './answerValidationSections/fileUploadChildPension'
import { paymentInfo } from './answerValidationSections/paymentInfo'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOUSEHOLDSUPPLEMENT,
  EMPLOYMENT,
  EMPLOYERS,
  FILEUPLOADCHILDPENSION,
  PAYMENTINFO,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [EMPLOYMENT]: employment,
  [EMPLOYERS]: employers,
  [FILEUPLOADPENEARLYFISHER]: fileUpploadPenEarlyFisher,
  [FILEUPLOADHOUSEHOLDSUPPLEMENT]: fileUploadHouseholdSupplement,
  [FILEUPLOADCHILDPENSION]: fileUploadChildPension,
  [PAYMENTINFO]: paymentInfo,
}
