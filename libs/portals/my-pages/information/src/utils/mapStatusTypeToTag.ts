import { HmsRentalAgreementStatusType } from '@island.is/api/schema'
import { ActionCardProps } from '@island.is/island-ui/core/types'
import { MessageDescriptor } from 'react-intl'
import { contractsMessages as m } from '../lib/messages'

export const mapStatusTypeToTag = (
  status: HmsRentalAgreementStatusType,
):
  | Omit<ActionCardProps['tag'] & { message: MessageDescriptor }, 'label'>
  | undefined => {
  switch (status) {
    case HmsRentalAgreementStatusType.CANCELLATION_REQUESTED:
      return {
        message: m.inProgress,
        variant: 'blue',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.CANCELLED:
      return {
        message: m.cancelled,
        variant: 'purple',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.EXPIRED:
      return {
        message: m.expired,
        variant: 'purple',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.INVALID:
      return {
        message: m.cancelled,
        variant: 'purple',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.PENDING_CANCELLATION:
      return {
        message: m.pendingCancellation,
        variant: 'yellow',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.PENDING_TERMINATION:
      return {
        message: m.pendingTermination,
        variant: 'yellow',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.TERMINATED:
      return {
        message: m.terminated,
        variant: 'purple',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.VALID:
      return {
        message: m.active,
        variant: 'mint',
        outlined: true,
      }
  }
}
