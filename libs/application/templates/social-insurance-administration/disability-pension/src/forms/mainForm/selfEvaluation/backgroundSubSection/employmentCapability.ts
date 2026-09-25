import {
  buildCustomField,
  buildMultiField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'

export const employmentCapabilityField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY,
  title: m.selfEvaluation.questionFormTitle,
  space: 'gutter',
  children: [
    buildTitleField({
      title: m.questions.employmentCapabilityTitle,
    }),
    buildCustomField(
      {
        id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY}.capability`,
        component: 'RestrictedNumericInput',
        childInputIds: [
          `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY}.capability`,
        ],
      },
      {
        min: 0,
        max: 100,
        label: m.questions.employmentCapabilityLabel,
      },
    ),
  ],
})
