import {
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'

export const educationLevelField = buildTitleField({
  title: disabilityPensionFormMessage.questions.educationLevelTitle,
})