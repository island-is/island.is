import {
  buildMultiField,
  buildTextField,
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
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY}.capability`,
      title: m.questions.employmentCapabilityLabel,
      variant: 'number',
      maxLength: 3,
      min: 0,
      max: 100,
      required: true,
      width: 'full',
    }),
  ],
})
