import { TagVariant } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'

import { DirectorateOfEqualitySubmissionStatus } from '../mocks/types'
import { messages } from './messages'

export const getStatusTag = (
  status: DirectorateOfEqualitySubmissionStatus,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant } => {
  switch (status) {
    case DirectorateOfEqualitySubmissionStatus.APPROVED:
      return { label: formatMessage(messages.statusApproved), variant: 'mint' }
    case DirectorateOfEqualitySubmissionStatus.REJECTED:
      return { label: formatMessage(messages.statusRejected), variant: 'red' }
    default:
      return { label: formatMessage(messages.statusInReview), variant: 'blue' }
  }
}
