import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const icelandicCapabilityField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY}.capability`,
      title: m.questions.icelandicCapabilityTitle,
      required: true,
      options: [
        {
          value: '0',
          label: m.questions.icelandicCapabilityPoor,
        },
        {
          value: '1',
          label: m.questions.icelandicCapabilityFair,
        },
        {
          value: '2',
          label: m.questions.icelandicCapabilityGood,
        },
        {
          value: '3',
          label:
            m.questions.icelandicCapabilityVeryGood,
        },
      ],
    }),
  ],
})
