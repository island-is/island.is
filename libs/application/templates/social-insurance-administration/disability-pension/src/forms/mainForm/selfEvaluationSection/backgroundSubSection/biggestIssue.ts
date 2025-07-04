import {
    buildMultiField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'

export const biggestIssueField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildTitleField({
      marginTop: 6,
      title: disabilityPensionFormMessage.questions.employmentCapabilityTitle,
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE}.text`,
      variant: 'textarea',
      rows: 4,
      width: 'full',
    })]
})
