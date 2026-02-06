import { AgreementStatusType, PartyType } from './enums'

export const LANDLORD_TYPES: PartyType[] = [
  PartyType.AGENT_FOR_OWNER,
  PartyType.OWNER,
  PartyType.OWNER_TAKEOVER,
]

export const TENANT_TYPES: PartyType[] = [
  PartyType.TENANT,
  PartyType.AGENT_FOR_TENANT,
]

export const TERMINATED_AGREEMENT_STATUSES: AgreementStatusType[] = [
  AgreementStatusType.CANCELLATION_REQUESTED,
  AgreementStatusType.PENDING_CANCELLATION,
  AgreementStatusType.PENDING_TERMINATION,
  AgreementStatusType.CANCELLED,
  AgreementStatusType.TERMINATED,
]

export const AGREEMENT_STATUS_SORT_ORDER: Record<AgreementStatusType, number> =
  {
    valid: 1,
    expired: 2,
    cancellationRequested: 3,
    pendingCancellation: 4,
    cancelled: 5,
    pendingTermination: 6,
    terminated: 7,
    invalid: 8,
    unknown: 9,
  }
