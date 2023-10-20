import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpload } from './answerValidationSections/fileUpload'
import { period } from './answerValidationSections/period'
import { fileUploadHouseholdSupplement } from './answerValidationSections/fileUploadHouseholdSupplement'
import { employment } from './answerValidationSections/employment'
import { validateLastestEmployer } from './answerValidationSections/validateLastestEmployer'
import { fileUploadChildPension } from './answerValidationSections/fileUploadChildPension'
import { paymentInfo } from './answerValidationSections/paymentInfo'
import { validateLastestChild } from './answerValidationSections/validateLastestChild'

const {
  PERIOD,
  FILEUPLOAD,
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
  [FILEUPLOAD]: fileUpload,
  [FILEUPLOADHOUSEHOLDSUPPLEMENT]: fileUploadHouseholdSupplement,
  [FILEUPLOADCHILDPENSION]: fileUploadChildPension,
  [PAYMENTINFO]: paymentInfo,
  [VALIDATE_LATEST_CHILD]: validateLastestChild,
}
