import {
    buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const educationLevelField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildRadioField({
      id: `${ SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
      title: disabilityPensionFormMessage.questions.educationLevelTitle,
      options: [{
        value: 'test',
        label: 'test'
      }]
    })]
})
