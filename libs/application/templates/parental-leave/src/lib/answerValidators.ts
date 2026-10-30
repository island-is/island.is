import { AnswerValidator } from '@island.is/application/core'

import { AnswerValidationConstants } from '../constants'

import { requestRightsValidationSection } from './answerValidationSections/requestRightsValidationSection'
import { giveRightsValidationSection } from './answerValidationSections/giveRightsValidationSection'
import { validateLatestPeriodValidationSection } from './answerValidationSections/validateLatestPeriodValidationSection'
import { validatePeriodsValidationSection } from './answerValidationSections/validatePeriodsValidationSection'
import { selectedChildValidationSection } from './answerValidationSections/selectedChildValidationSection'
import { employersValidationSection } from './answerValidationSections/employersValidationSection'

const {
  REQUEST_RIGHTS,
  GIVE_RIGHTS,
  VALIDATE_LATEST_PERIOD,
  VALIDATE_PERIODS,
  SELECTED_CHILD,
  EMPLOYERS,
} = AnswerValidationConstants

export const answerValidators: Record<string, AnswerValidator> = {
  [REQUEST_RIGHTS]: requestRightsValidationSection,
  [GIVE_RIGHTS]: giveRightsValidationSection,
  [VALIDATE_LATEST_PERIOD]: validateLatestPeriodValidationSection,
  [VALIDATE_PERIODS]: validatePeriodsValidationSection,
  [SELECTED_CHILD]: selectedChildValidationSection,
  [EMPLOYERS]: employersValidationSection,
}
