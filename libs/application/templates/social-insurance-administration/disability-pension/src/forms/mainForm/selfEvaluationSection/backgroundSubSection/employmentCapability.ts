import {
    buildMultiField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const employmentCapabilityField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  space: 'gutter',
  children: [
    buildTitleField({
      title: disabilityPensionFormMessage.questions.employmentCapabilityTitle,
  }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY}.capability`,
      title: disabilityPensionFormMessage.questions.employmentCapabilityLabel,
      variant: 'number',
      required: true,
      width: 'full',
  })]
})
