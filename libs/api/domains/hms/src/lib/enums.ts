import { registerEnumType } from '@nestjs/graphql'

export enum PartyType {
  OWNER = 'owner',
  TENANT = 'tenant',
  AGENCY = 'agency',
  AGENT_FOR_OWNER = 'agentForOwner',
  AGENT_FOR_TENANT = 'agentForTenant',
  OWNER_TAKEOVER = 'ownerTakeover',
  UNKNOWN = 'unknown',
}

export enum TemporalType {
  TEMPORARY = 'temporary',
  INDEFINITE = 'indefinite',
  UNKNOWN = 'unknown',
}

export enum AgreementStatusType {
  VALID = 'valid',
  INVALID = 'invalid',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TERMINATED = 'terminated',
  CANCELLATION_REQUESTED = 'cancellationRequested',
  PENDING_CANCELLATION = 'pendingCancellation',
  PENDING_TERMINATION = 'pendingTermination',
  UNKNOWN = 'unknown',
}

export enum PropertyType {
  INDIVIDUAL_ROOM = 'individualRoom',
  RESIDENTIAL = 'residential',
  NONRESIDENTIAL = 'nonResidential',
  UNKNOWN = 'unknown',
}

//registers
registerEnumType(AgreementStatusType, {
  name: 'HmsRentalAgreementStatusType',
})
registerEnumType(PartyType, {
  name: 'HmsRentalAgreementPartyType',
})
registerEnumType(TemporalType, {
  name: 'HmsRentalAgreementTemporalType',
})
registerEnumType(PropertyType, {
  name: 'HmsRentalAgreementPropertyType',
})
