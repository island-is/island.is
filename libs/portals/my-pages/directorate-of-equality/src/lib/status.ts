import { TagVariant } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/my-pages/core'

import { DirectorateOfEqualitySubmissionStatus } from '@island.is/api/schema'
import { ApiKeyState } from './apiKeys'
import { messages } from './messages'

export const getApiKeyTag = (
  state: ApiKeyState,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant } => {
  switch (state) {
    case 'revoked':
      return { label: formatMessage(messages.keyRevoked), variant: 'red' }
    case 'expired':
      return { label: formatMessage(messages.keyExpired), variant: 'blue' }
    default:
      return { label: formatMessage(messages.active), variant: 'mint' }
  }
}

export const getStatusTag = (
  status: DirectorateOfEqualitySubmissionStatus,
  formatMessage: FormatMessage,
): { label: string; variant: TagVariant } | undefined => {
  switch (status) {
    case DirectorateOfEqualitySubmissionStatus.IN_REVIEW:
      return { label: formatMessage(messages.statusInReview), variant: 'blue' }
    case DirectorateOfEqualitySubmissionStatus.APPROVED:
      return { label: formatMessage(coreMessages.approved), variant: 'mint' }
    case DirectorateOfEqualitySubmissionStatus.REJECTED:
      return { label: formatMessage(coreMessages.rejected), variant: 'red' }
    case DirectorateOfEqualitySubmissionStatus.SUPERSEDED:
      return {
        label: formatMessage(messages.statusSuperseded),
        variant: 'purple',
      }
    case DirectorateOfEqualitySubmissionStatus.WITHDRAWN:
      return { label: formatMessage(messages.statusWithdrawn), variant: 'dark' }
    default:
      return undefined
  }
}
