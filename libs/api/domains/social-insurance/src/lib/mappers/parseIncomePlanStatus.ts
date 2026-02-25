import { IncomePlanStatus } from '../socialInsurance.type'
import { IncomePlanStatus as IncomeStatus } from '@island.is/clients/social-insurance-administration'

export const parseIncomePlanStatus = (
  status: IncomeStatus,
): IncomePlanStatus => {
  switch (status) {
    case 'Accepted':
      return IncomePlanStatus.ACCEPTED
    case 'InProgress':
      return IncomePlanStatus.IN_PROGRESS
    case 'Cancelled':
      return IncomePlanStatus.CANCELLED
    default:
      return IncomePlanStatus.UNKNOWN
  }
}
