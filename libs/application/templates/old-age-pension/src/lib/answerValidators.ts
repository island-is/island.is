import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUploadPenEarlyFisher } from './answerValidationSections/fileUploadPenEarlyFisher'
import { period } from './answerValidationSections/period'
import { fileUploadHouseholdSupplement } from './answerValidationSections/fileUploadHouseholdSupplement'
import { employment } from './answerValidationSections/employment'
import { validateLastestEmployer } from './answerValidationSections/validateLastestEmployer'
import { fileUploadChildPension } from './answerValidationSections/fileUploadChildPension'
import { paymentInfo } from './answerValidationSections/paymentInfo'
import { validateLastestChild } from './answerValidationSections/validateLastestChild'

const {
  PERIOD,
  FILEUPLOADPENEARLYFISHER,
  FILEUPLOADHOUSEHOLDSUPPLEMENT,
  EMPLOYMENT,
  VALIDATE_LATEST_EMPLOYER,
  FILEUPLOADCHILDPENSION,
  PAYMENTINFO,
  VALIDATE_LATEST_CHILD,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [EMPLOYMENT]: employment,
  [VALIDATE_LATEST_EMPLOYER]: validateLastestEmployer,
  [FILEUPLOADPENEARLYFISHER]: fileUploadPenEarlyFisher,
  [FILEUPLOADHOUSEHOLDSUPPLEMENT]: fileUploadHouseholdSupplement,
  [FILEUPLOADCHILDPENSION]: fileUploadChildPension,
  [PAYMENTINFO]: paymentInfo,
  [VALIDATE_LATEST_CHILD]: validateLastestChild,
}
