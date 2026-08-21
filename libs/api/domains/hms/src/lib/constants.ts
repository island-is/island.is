import {
  AgreementStatusType,
  PartyType,
} from './models/rentalAgreements/rentalAgreement.model'

export const LANDLORD_TYPES = [
  PartyType.AGENT_FOR_OWNER,
  PartyType.OWNER,
  PartyType.OWNER_TAKEOVER,
]

export const TENANT_TYPES = [PartyType.TENANT, PartyType.AGENT_FOR_TENANT]

export const AGREEMENT_STATUS_ORDER: AgreementStatusType[] = [
  AgreementStatusType.VALID,
  AgreementStatusType.CANCELLATION_REQUESTED,
  AgreementStatusType.PENDING_CANCELLATION,
  AgreementStatusType.PENDING_TERMINATION,
  AgreementStatusType.TERMINATED,
  AgreementStatusType.EXPIRED,
  AgreementStatusType.CANCELLED,
  AgreementStatusType.INVALID,
  AgreementStatusType.UNKNOWN,
]
