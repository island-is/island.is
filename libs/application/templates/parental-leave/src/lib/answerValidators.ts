import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from '../constants'
import { employerValidationSection } from './answerValidationSections/employerValidationSection'
import { fileUploadValidationSection } from './answerValidationSections/fileUploadValidationSection'
import { requestRightsValidationSection } from './answerValidationSections/requestRightsValidationSection'
import { giveRightsValidationSection } from './answerValidationSections/giveRightsValidationSection'
import { paymentsValidationSection } from './answerValidationSections/paymentsValidationSection'
import { validateLatestPeriodValidationSection } from './answerValidationSections/validateLatestPeriodValidationSection'
import { validatePeriodsValidationSection } from './answerValidationSections/validatePeriodsValidationSection'
import { validateLatestEmployerValidationSection } from './answerValidationSections/validateLastestEmployerValidationSection'

const {
  EMPLOYER,
  FILEUPLOAD,
  REQUEST_RIGHTS,
  GIVE_RIGHTS,
  PAYMENTS,
  VALIDATE_LATEST_PERIOD,
  VALIDATE_PERIODS,
  EMPLOYERS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [EMPLOYER]: employerValidationSection,
  [FILEUPLOAD]: fileUploadValidationSection,
  [REQUEST_RIGHTS]: requestRightsValidationSection,
  [GIVE_RIGHTS]: giveRightsValidationSection,
  [PAYMENTS]: paymentsValidationSection,
  [VALIDATE_LATEST_PERIOD]: validateLatestPeriodValidationSection,
  [VALIDATE_PERIODS]: validatePeriodsValidationSection,
  [EMPLOYERS]: validateLatestEmployerValidationSection,
}
