import {
  buildMultiField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'

export const biggestIssueField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildTitleField({
      marginTop: 2,
      title: m.questions.biggestIssueTitle,
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE}.text`,
      variant: 'textarea',
      rows: 6,
      width: 'full',
    }),
  ],
})
