import { buildMultiField, buildRadioField } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { mockEducationLevels } from '../../../../utils/mockData'

export const educationLevelField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EDUCATION_LEVEL}.level`,
      title: disabilityPensionFormMessage.questions.educationLevelTitle,
      options: mockEducationLevels.map((level) => ({
        value: level.value,
        label: level.label,
      })),
    }),
  ],
})
