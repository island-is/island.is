import {
  buildMultiField,
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { EmploymentImportanceEnum, SectionRouteEnum } from '../../../../types'

export const employmentImportanceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE}.importance`,
      title: disabilityPensionFormMessage.questions.employmentImportanceTitle,
      options: [
        {
          value: EmploymentImportanceEnum.NOT_IMPORTANT_AT_ALL,
          label: disabilityPensionFormMessage.questions.employmentImportanceNotImportantAtAll,
        },
        {
          value: EmploymentImportanceEnum.NOT_IMPORTANT,
          label: disabilityPensionFormMessage.questions.employmentImportanceNotImportant,
        },
        {
          value: EmploymentImportanceEnum.NEUTRAL,
          label: disabilityPensionFormMessage.questions.employmentImportanceNeutral,
        },
        {
          value: EmploymentImportanceEnum.IMPORTANT,
          label: disabilityPensionFormMessage.questions.employmentImportanceImportant,
        },
        {
          value: EmploymentImportanceEnum.VERY_IMPORTANT,
          label: disabilityPensionFormMessage.questions.employmentImportanceVeryImportant,
        },
      ]
    }),
  ]
})
