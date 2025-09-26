import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { generateIcelandicCapabilityOptions } from '../../../../utils/options'

export const icelandicCapabilityField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_ICELANDIC_CAPABILITY}.capability`,
      title: m.questions.icelandicCapabilityTitle,
      required: true,
      options: generateIcelandicCapabilityOptions(m),
    }),
  ],
})
