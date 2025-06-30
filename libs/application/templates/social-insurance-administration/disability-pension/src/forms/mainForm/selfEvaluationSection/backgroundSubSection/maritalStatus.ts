import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { backgroundRoute } from './index'

export const maritalStatusField =
  buildRadioField({
    id: `${backgroundRoute}.maritalStatus`,
    title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
    description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
    options: []
  })
