import { buildMultiField, buildRadioField } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const employmentImportanceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE}.importance`,
      title: disabilityPensionFormMessage.questions.employmentImportanceTitle,
      options: [
        {
          value: '0',
          label:
            disabilityPensionFormMessage.questions
              .employmentImportanceNotImportantAtAll,
        },
        {
          value: '1',
          label:
            disabilityPensionFormMessage.questions
              .employmentImportanceNotImportant,
        },
        {
          value: '2',
          label:
            disabilityPensionFormMessage.questions.employmentImportanceNeutral,
        },
        {
          value: '3',
          label:
            disabilityPensionFormMessage.questions
              .employmentImportanceImportant,
        },
        {
          value: '4',
          label:
            disabilityPensionFormMessage.questions
              .employmentImportanceVeryImportant,
        },
      ],
    }),
  ],
})
