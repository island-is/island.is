import { buildMultiField, buildRadioField } from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const icelandicCapabilityField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY}.capability`,
      title: disabilityPensionFormMessage.questions.icelandicCapabilityTitle,
      options: [
        {
          value: '0',
          label: disabilityPensionFormMessage.questions.icelandicCapabilityPoor,
        },
        {
          value: '1',
          label: disabilityPensionFormMessage.questions.icelandicCapabilityFair,
        },
        {
          value: '2',
          label: disabilityPensionFormMessage.questions.icelandicCapabilityGood,
        },
        {
          value: '3',
          label:
            disabilityPensionFormMessage.questions.icelandicCapabilityVeryGood,
        },
      ],
    }),
  ],
})
