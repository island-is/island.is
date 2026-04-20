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
    case HmsRentalAgreementStatusType.VALID:
      return {
        message: m.active,
        variant: 'mint',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.CANCELLED:
      return {
        message: m.cancelled,
        variant: 'red',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.EXPIRED:
      return {
        message: m.expired,
        variant: 'red',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.INVALID:
      return {
        message: m.invalid,
        variant: 'red',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.TERMINATED:
      return {
        message: m.terminated,
        variant: 'red',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.CANCELLATION_REQUESTED:
    case HmsRentalAgreementStatusType.PENDING_CANCELLATION:
      return {
        message: m.pendingCancellation,
        variant: 'purple',
        outlined: true,
      }
    case HmsRentalAgreementStatusType.PENDING_TERMINATION:
      return {
        message: m.pendingTermination,
        variant: 'purple',
        outlined: true,
      }
  }
}
