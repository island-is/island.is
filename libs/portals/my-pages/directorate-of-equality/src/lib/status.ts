import { TagVariant } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'

import { DirectorateOfEqualitySubmissionStatus } from '@island.is/api/schema'
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
    case DirectorateOfEqualitySubmissionStatus.SUPERSEDED:
      return {
        label: formatMessage(messages.statusSuperseded),
        variant: 'purple',
      }
    case DirectorateOfEqualitySubmissionStatus.WITHDRAWN:
      return { label: formatMessage(messages.statusWithdrawn), variant: 'dark' }
    default:
      return { label: formatMessage(messages.statusInReview), variant: 'blue' }
  }
}
