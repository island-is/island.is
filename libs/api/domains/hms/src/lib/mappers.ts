import {
  type RentalAgreementDto,
  type ContractPartyDto,
  type ContractPropertyDto,
  type AgreementStatusType as ClientAgreementStatusType,
  type PartyType as ClientPartyType,
  type TemporalType as ClientTemporalType,
  type RentalPropertyType,
} from '@island.is/clients/hms-rental-agreement'
import { LANDLORD_TYPES, TENANT_TYPES } from './constants'
import { Address } from './models/rentalAgreements/address.model'
import { ContractParty } from './models/rentalAgreements/contractParty.model'
import {
  ContractProperty,
  PropertyType,
} from './models/rentalAgreements/contractProperty.model'
import {
  AgreementStatusType,
  PartyType,
  RentalAgreement,
  TemporalType,
} from './models/rentalAgreements/rentalAgreement.model'

const AGREEMENT_STATUS_MAP: Record<
  ClientAgreementStatusType,
  AgreementStatusType
> = {
  valid: AgreementStatusType.VALID,
  invalid: AgreementStatusType.INVALID,
  expired: AgreementStatusType.EXPIRED,
  cancelled: AgreementStatusType.CANCELLED,
  terminated: AgreementStatusType.TERMINATED,
  cancellationRequested: AgreementStatusType.CANCELLATION_REQUESTED,
  pendingCancellation: AgreementStatusType.PENDING_CANCELLATION,
  pendingTermination: AgreementStatusType.PENDING_TERMINATION,
  unknown: AgreementStatusType.UNKNOWN,
}

const PARTY_TYPE_MAP: Record<ClientPartyType, PartyType> = {
  owner: PartyType.OWNER,
  tenant: PartyType.TENANT,
  agency: PartyType.AGENCY,
  agentForOwner: PartyType.AGENT_FOR_OWNER,
  agentForTenant: PartyType.AGENT_FOR_TENANT,
  ownerTakeover: PartyType.OWNER_TAKEOVER,
  unknown: PartyType.UNKNOWN,
}

const TEMPORAL_TYPE_MAP: Record<ClientTemporalType, TemporalType> = {
  indefinite: TemporalType.INDEFINITE,
  temporary: TemporalType.TEMPORARY,
  unknown: TemporalType.UNKNOWN,
}

const PROPERTY_TYPE_MAP: Record<RentalPropertyType, PropertyType> = {
  individualRoom: PropertyType.INDIVIDUAL_ROOM,
  residential: PropertyType.RESIDENTIAL,
  nonresidential: PropertyType.NONRESIDENTIAL,
  unknown: PropertyType.UNKNOWN,
}

const mapAddress = (dto: ContractPartyDto): Address | undefined => {
  if (!dto.address) return undefined
  return {
    streetAddress: dto.address.address,
    city: dto.address.town,
    postalCode: dto.address.postalCode,
    country: dto.address.country,
  }
}

const mapContractParty = (dto: ContractPartyDto): ContractParty => ({
  id: dto.id,
  type: PARTY_TYPE_MAP[dto.type],
  name: dto.name,
  nationalId: dto.nationalId,
  address: mapAddress(dto),
  phoneNumber: dto.phoneNumber,
  email: dto.email,
})

const mapContractProperty = (
  dto: ContractPropertyDto,
): ContractProperty => ({
  id: dto.id,
  propertyId: dto.propertyId,
  type: PROPERTY_TYPE_MAP[dto.type],
  postalCode: dto.postalCode,
  streetAndHouseNumber: dto.streetAndHouseNumber,
  municipality: dto.municipality,
})

export const mapToRentalAgreement = (dto: RentalAgreementDto): RentalAgreement => {
  const parties = dto.contractParty?.map(mapContractParty)

  return {
    id: dto.id,
    status: AGREEMENT_STATUS_MAP[dto.status],
    contractType: TEMPORAL_TYPE_MAP[dto.contractType],
    dateFrom: dto.dateFrom?.toISOString(),
    dateTo: dto.dateTo?.toISOString(),
    terminationDate: dto.terminationDate?.toISOString(),
    landlords: parties?.filter((p) => LANDLORD_TYPES.includes(p.type)),
    tenants: parties?.filter((p) => TENANT_TYPES.includes(p.type)),
    contractProperty: dto.contractProperty
      ? mapContractProperty(dto.contractProperty[0])
      : undefined,
    documents: dto.documents?.map((d) => ({
      id: d.id,
      name: d.name,
    })),
  }
}
