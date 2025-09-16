import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'

export const employmentImportanceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE}.importance`,
      title: m.questions.employmentImportanceTitle,
      options: [
        {
          value: '0',
          label: m.questions.employmentImportanceNotImportantAtAll,
        },
        {
          value: '1',
          label: m.questions.employmentImportanceNotImportant,
        },
        {
          value: '2',
          label: m.questions.employmentImportanceNeutral,
        },
        {
          value: '3',
          label: m.questions.employmentImportanceImportant,
        },
        {
          value: '4',
          label: m.questions.employmentImportanceVeryImportant,
        },
      ],
    }),
  ],
})
