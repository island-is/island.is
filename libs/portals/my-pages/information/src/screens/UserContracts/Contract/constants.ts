import { HmsRentalAgreementStatusType } from '@island.is/api/schema'

export const TERMINATED_STATUSES: HmsRentalAgreementStatusType[] = [
  HmsRentalAgreementStatusType.CANCELLATION_REQUESTED,
  HmsRentalAgreementStatusType.PENDING_CANCELLATION,
  HmsRentalAgreementStatusType.CANCELLED,
  HmsRentalAgreementStatusType.PENDING_TERMINATION,
  HmsRentalAgreementStatusType.TERMINATED,
]
