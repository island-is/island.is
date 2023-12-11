import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUpload } from './answerValidationSections/fileUpload'
import { period } from './answerValidationSections/period'
import { validateLastestEmployer } from './answerValidationSections/validateLastestEmployer'
import { paymentInfo } from './answerValidationSections/paymentInfo'

const { PERIOD, FILEUPLOAD, VALIDATE_LATEST_EMPLOYER, PAYMENTINFO } =
  AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [PERIOD]: period,
  [VALIDATE_LATEST_EMPLOYER]: validateLastestEmployer,
  [FILEUPLOAD]: fileUpload,
  [PAYMENTINFO]: paymentInfo,
}
