import { PartyType } from './models/rentalAgreements/rentalAgreement.model'

export const LANDLORD_TYPES = [
  PartyType.AGENT_FOR_OWNER,
  PartyType.OWNER,
  PartyType.OWNER_TAKEOVER,
]

export const TENANT_TYPES = [PartyType.TENANT, PartyType.AGENT_FOR_TENANT]
