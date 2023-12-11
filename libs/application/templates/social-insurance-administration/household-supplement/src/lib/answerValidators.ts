import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from './constants'
import { fileUploadValidationSection } from './answerValidationSections/fileUploadValidationSection'

const { FILEUPLOAD } = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [FILEUPLOAD]: fileUploadValidationSection,
}
