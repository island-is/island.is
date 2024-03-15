import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from '../constants'
import { employerValidationSection } from './answerValidationSections/employerValidationSection'
import { requestRightsValidationSection } from './answerValidationSections/requestRightsValidationSection'
import { giveRightsValidationSection } from './answerValidationSections/giveRightsValidationSection'
import { validateLatestPeriodValidationSection } from './answerValidationSections/validateLatestPeriodValidationSection'
import { validatePeriodsValidationSection } from './answerValidationSections/validatePeriodsValidationSection'

const {
  EMPLOYER,
  REQUEST_RIGHTS,
  GIVE_RIGHTS,
  VALIDATE_LATEST_PERIOD,
  VALIDATE_PERIODS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [EMPLOYER]: employerValidationSection,
  [REQUEST_RIGHTS]: requestRightsValidationSection,
  [GIVE_RIGHTS]: giveRightsValidationSection,
  [VALIDATE_LATEST_PERIOD]: validateLatestPeriodValidationSection,
  [VALIDATE_PERIODS]: validatePeriodsValidationSection,
}
