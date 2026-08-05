import type { TagVariant } from '@island.is/island-ui/core'
import { VmstApplicationStatus } from '@island.is/api/schema'

const statusTagVariantMap: Record<VmstApplicationStatus, TagVariant> = {
  [VmstApplicationStatus.approved]: 'mint',
  [VmstApplicationStatus.approvedWithWaitTime]: 'mint',
  [VmstApplicationStatus.newApplication]: 'mint',
  [VmstApplicationStatus.applicantInProgress]: 'purple',
  [VmstApplicationStatus.automaticSuspension]: 'purple',
  [VmstApplicationStatus.monitoringSuspension]: 'purple',
  [VmstApplicationStatus.suspensionMissingData]: 'purple',
  [VmstApplicationStatus.review]: 'purple',
  [VmstApplicationStatus.sanctions]: 'red',
  [VmstApplicationStatus.rejected]: 'red',
  [VmstApplicationStatus.deregistered]: 'red',
  [VmstApplicationStatus.closedInvalid]: 'red',
  [VmstApplicationStatus.unknown]: 'warn',
}

export const resolveStatusTagVariant = (
  status?: VmstApplicationStatus | null,
): TagVariant => statusTagVariantMap[status ?? VmstApplicationStatus.unknown]
