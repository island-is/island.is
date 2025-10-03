import { buildMultiField, buildRadioField } from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { yesOrNoOptions } from '../../../../utils'

export const assistanceField = buildMultiField({
  id: SectionRouteEnum.SELF_EVALUATION_ASSISTANCE,
  title: m.selfEvaluation.title,
  description: m.selfEvaluation.description,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.SELF_EVALUATION_ASSISTANCE}.assistance`,
      title: m.selfEvaluation.assistance,
      width: 'half',
      options: yesOrNoOptions,
    }),
  ],
})
