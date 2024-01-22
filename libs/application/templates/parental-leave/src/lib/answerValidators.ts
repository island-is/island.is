import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from '../constants'
import { employerValidationSection } from './answerValidationSections/employerValidationSection'
import { fileUploadValidationSection } from './answerValidationSections/fileUploadValidationSection'
import { multipleBirthValidationSection } from './answerValidationSections/multipleBirthValidationSection'
import { otherParentValidationSection } from './answerValidationSections/otherParentValidationSection'
import { requestRightsValidationSection } from './answerValidationSections/requestRightsValidationSection'
import { giveRightsValidationSection } from './answerValidationSections/giveRightsValidationSection'
import { paymentsValidationSection } from './answerValidationSections/paymentsValidationSection'
import { validateLatestPeriodValidationSection } from './answerValidationSections/validateLatestPeriodValidationSection'
import { validatePeriodsValidationSection } from './answerValidationSections/validatePeriodsValidationSection'
import { otherParentEmailValidationSection } from './answerValidationSections/otherParentEmailValidationSection'
import { validateLatestEmployerValidationSection } from './answerValidationSections/validateLastestEmployerValidationSection'

const {
  EMPLOYER,
  FILEUPLOAD,
  MULTIPLE_BIRTHS,
  OTHER_PARENT,
  OTHER_PARENT_EMAIL,
  REQUEST_RIGHTS,
  GIVE_RIGHTS,
  PAYMENTS,
  VALIDATE_LATEST_PERIOD,
  VALIDATE_PERIODS,
  EMPLOYERS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  //[EMPLOYER]: employerValidationSection,
  //[FILEUPLOAD]: fileUploadValidationSection,
  [MULTIPLE_BIRTHS]: multipleBirthValidationSection,
  [OTHER_PARENT]: otherParentValidationSection,
  [OTHER_PARENT_EMAIL]: otherParentEmailValidationSection,
  [REQUEST_RIGHTS]: requestRightsValidationSection,
  [GIVE_RIGHTS]: giveRightsValidationSection,
  [PAYMENTS]: paymentsValidationSection,
  [VALIDATE_LATEST_PERIOD]: validateLatestPeriodValidationSection,
  [VALIDATE_PERIODS]: validatePeriodsValidationSection,
  //[EMPLOYERS]: validateLatestEmployerValidationSection,
}
