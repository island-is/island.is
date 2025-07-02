import {
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../lib/routes'

export const biggestIssueField = buildTextField({
  id: SectionRouteEnum.BACKGROUND_INFO_BIGGEST_ISSUE,
  title: disabilityPensionFormMessage.questions.biggestIssueTitle,
  variant: 'textarea',
  rows: 4,
  width: 'full',
})
