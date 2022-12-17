import {
  AnswerValidator,
} from '@island.is/application/core'

import {
  AnswerValidationConstants,
} from '../constants'
import { employerValidationSection } from './answerValidationSections/employerValidationSection'
import { fileUploadValidationSection } from './answerValidationSections/fileUploadValidationSection'
import { multipleBirthValidationSection } from './answerValidationSections/multipleBirthValidationSection'
import { otherParentValidationSection } from './answerValidationSections/otherParentValidationSection'
import { requestRightsValidationSection } from './answerValidationSections/requestRightsValidationSection'
import { giveRightsValidationSection } from './answerValidationSections/giveRightsValidationSection'
import { paymentsValidationSection } from './answerValidationSections/paymentsValidationSection'
import { validateLatestPeriodValidationSection } from './answerValidationSections/validateLatestPeriodValidationSection'
import { validatePeriodsValidationSchema } from './answerValidationSections/validatePeriodsValidationSchema'

const {
  EMPLOYER,
  FILEUPLOAD,
  MULTIPLE_BIRTHS,
  OTHER_PARENT,
  REQUEST_RIGHTS,
  GIVE_RIGHTS,
  PAYMENTS,
  VALIDATE_LATEST_PERIOD,
  VALIDATE_PERIODS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [EMPLOYER]: employerValidationSection,
  [FILEUPLOAD]: fileUploadValidationSection,
  [MULTIPLE_BIRTHS]: multipleBirthValidationSection,
  [OTHER_PARENT]: otherParentValidationSection,
  [REQUEST_RIGHTS]: requestRightsValidationSection,
  [GIVE_RIGHTS]: giveRightsValidationSection,
  [PAYMENTS]: paymentsValidationSection,
  [VALIDATE_LATEST_PERIOD]: validateLatestPeriodValidationSection,
  [VALIDATE_PERIODS]: validatePeriodsValidationSchema,
}
