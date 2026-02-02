import {
  AddressDto,
  AgreementStatusType as AgreementStatusClientType,
  ContractPartyDto,
  ContractPropertyDto,
  PartyType as PartyClientType,
  RentalAgreementDto,
  TemporalType as TemporalClientType,
  RentalPropertyType,
} from '@island.is/clients/hms-rental-agreement'
import { LANDLORD_TYPES, TENANT_TYPES } from './constants'
import { Address } from './models/rentalAgreements/address.model'
import { ContractParty } from './models/rentalAgreements/contractParty.model'
import { ContractProperty } from './models/rentalAgreements/contractProperty.model'
import {
  AgreementStatusType,
  PartyType,
  PropertyType,
  TemporalType,
} from './enums'
import { RentalAgreement } from './models/rentalAgreements/rentalAgreement.model'

const mapAddress = (addressDto?: AddressDto): Address | undefined => {
  if (!addressDto) return undefined

  return {
    streetAddress: addressDto.address,
    city: addressDto.town,
    postalCode: addressDto.postalCode,
    country: addressDto.country,
  }
}

const mapContractParty = (partyDto: ContractPartyDto): ContractParty => {
  return {
    id: partyDto.id,
    type: mapPartyType(partyDto.type),
    name: partyDto.name,
    nationalId: partyDto.nationalId,
    address: mapAddress(partyDto.address),
    phoneNumber: partyDto.phoneNumber,
    email: partyDto.email,
  }
}

const mapContractProperty = (
  propertyDto: ContractPropertyDto,
): ContractProperty => {
  return {
    id: propertyDto.id,
    propertyId: propertyDto.propertyId,
    type: mapPropertyType(propertyDto.type),
    postalCode: propertyDto.postalCode,
    streetAndHouseNumber: propertyDto.streetAndHouseNumber,
    municipality: propertyDto.municipality,
  }
}

const mapAgreementStatus = (
  status: AgreementStatusClientType,
): AgreementStatusType => {
  switch (status) {
    case 'valid':
      return AgreementStatusType.VALID
    case 'invalid':
      return AgreementStatusType.INVALID
    case 'expired':
      return AgreementStatusType.EXPIRED
    case 'cancelled':
      return AgreementStatusType.CANCELLED
    case 'terminated':
      return AgreementStatusType.TERMINATED
    case 'cancellationRequested':
      return AgreementStatusType.CANCELLATION_REQUESTED
    case 'pendingCancellation':
      return AgreementStatusType.PENDING_CANCELLATION
    case 'pendingTermination':
      return AgreementStatusType.PENDING_TERMINATION
    default:
      return AgreementStatusType.UNKNOWN
  }
}

const mapPartyType = (type: PartyClientType): PartyType => {
  switch (type) {
    case 'agency':
      return PartyType.AGENCY
    case 'tenant':
      return PartyType.TENANT
    case 'owner':
      return PartyType.OWNER
    case 'agentForOwner':
      return PartyType.AGENT_FOR_OWNER
    case 'agentForTenant':
      return PartyType.AGENT_FOR_TENANT
    case 'ownerTakeover':
      return PartyType.OWNER_TAKEOVER
    default:
      return PartyType.UNKNOWN
  }
}

const mapPropertyType = (type: RentalPropertyType): PropertyType => {
  switch (type) {
    case 'individualRoom':
      return PropertyType.INDIVIDUAL_ROOM
    case 'nonresidential':
      return PropertyType.NONRESIDENTIAL
    case 'residential':
      return PropertyType.RESIDENTIAL
    default:
      return PropertyType.UNKNOWN
  }
}

const mapTemporalType = (type: TemporalClientType): TemporalType => {
  switch (type) {
    case 'indefinite':
      return TemporalType.INDEFINITE
    case 'temporary':
      return TemporalType.TEMPORARY
    default:
      return TemporalType.UNKNOWN
  }
}

export const mapToRentalAgreement = (
  dto: RentalAgreementDto,
  downloadServiceBaseUrl: string,
): RentalAgreement => {
  const property = dto.contractProperty?.[0]
    ? mapContractProperty(dto.contractProperty[0])
    : undefined

  const parties = dto.contractParty?.map(mapContractParty)
  const documents = dto.documents?.map((doc) => ({
    id: doc.id,
    name: doc.name,
    downloadUrl: `${downloadServiceBaseUrl}/download/v1/rental-agreements/${doc.id}`,
  }))

  return {
    id: dto.id,
    status: mapAgreementStatus(dto.status),
    contractType: mapTemporalType(dto.contractType),
    dateFrom: dto.dateFrom?.toISOString(),
    dateTo: dto.dateTo?.toISOString(),
    terminationDate: dto.terminationDate?.toISOString(),
    landlords:
      parties?.filter((party) => LANDLORD_TYPES.includes(party.type)) ??
      undefined,
    tenants:
      parties?.filter((party) => TENANT_TYPES.includes(party.type)) ??
      undefined,
    contractProperty: property,
    documents,
  }
}
