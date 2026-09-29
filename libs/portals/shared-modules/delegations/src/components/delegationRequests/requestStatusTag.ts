import type { TagVariant } from '@island.is/island-ui/core'
import { AuthDelegationRequestStatus } from '@island.is/api/schema'

import { m } from '../../lib/messages'

/** Status tag shown for a resolved delegation request (both directions). */
export const requestStatusTag: Partial<
  Record<
    AuthDelegationRequestStatus,
    { label: typeof m.requestTagApproved; variant: TagVariant }
  >
> = {
  [AuthDelegationRequestStatus.approved]: {
    label: m.requestTagApproved,
    variant: 'mint',
  },
  [AuthDelegationRequestStatus.rejected]: {
    label: m.requestTagRejected,
    variant: 'red',
  },
  [AuthDelegationRequestStatus.expired]: {
    label: m.requestTagExpired,
    variant: 'red',
  },
  [AuthDelegationRequestStatus.cancelled]: {
    label: m.requestTagCancelled,
    variant: 'red',
  },
}
