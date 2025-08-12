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
  children: [
    buildTitleField({
      marginTop: 2,
      title: disabilityPensionFormMessage.questions.biggestIssueTitle,
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE}.text`,
      variant: 'textarea',
      rows: 6,
      width: 'full',
    }),
  ],
})
