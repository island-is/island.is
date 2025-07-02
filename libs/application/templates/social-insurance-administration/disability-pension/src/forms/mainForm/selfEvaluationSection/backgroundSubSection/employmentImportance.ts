import {
  buildRadioField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { EmploymentImportanceEnum } from '../../../../types'
import { SectionRouteEnum } from '../../../../types'

export const employmentImportanceField =
  buildRadioField({
    id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_IMPORTANCE,
    title: disabilityPensionFormMessage.questions.employmentImportanceTitle,
    options: [
      {
        value: EmploymentImportanceEnum.notImportantAtAll,
        label: disabilityPensionFormMessage.questions.employmentImportanceNotImportantAtAll,
      },
      {
        value: EmploymentImportanceEnum.notImportant,
        label: disabilityPensionFormMessage.questions.employmentImportanceNotImportant,
      },
      {
        value: EmploymentImportanceEnum.neutral,
        label: disabilityPensionFormMessage.questions.employmentImportanceNeutral,
      },
      {
        value: EmploymentImportanceEnum.important,
        label: disabilityPensionFormMessage.questions.employmentImportanceImportant,
      },
      {
        value: EmploymentImportanceEnum.veryImportant,
        label: disabilityPensionFormMessage.questions.employmentImportanceVeryImportant,
      },
    ]
  })
