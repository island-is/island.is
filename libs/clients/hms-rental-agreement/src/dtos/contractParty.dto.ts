import { type ContractParty } from '../../gen/fetch'
import { type PartyType } from '../types'
import { AddressDto, mapAddressDto } from './address.dto'

export interface ContractPartyDto {
  id: number
  type: PartyType
  name: string
  nationalId?: string
  address?: AddressDto
  phoneNumber?: string
  email?: string
}

export const mapContractPartyDto = (
  data: ContractParty,
): ContractPartyDto | null => {
  if (!data.contract_party_id || !data.name) return null
  return {
    id: data.contract_party_id,
    type: mapPartyType(data.party_type_use_code),
    name: data.name,
    nationalId: data.kennitala ?? undefined,
    address:
      mapAddressDto(
        data.address_1,
        data.town,
        data.postal_code,
        data.country,
      ) ?? undefined,
    phoneNumber: data.phone_number ?? undefined,
    email: data.email ?? undefined,
  }
}

const mapPartyType = (type?: string | null): PartyType => {
  switch (type) {
    case 'OWNER':
      return 'owner'
    case 'TENANT':
      return 'tenant'
    case 'AGENCY':
      return 'agency'
    case 'AGENTFOROWNER':
      return 'agentForOwner'
    case 'AGENTFORTENANT':
      return 'agentForTenant'
    case 'OWNERTAKEOVER':
      return 'ownerTakeover'
    default:
      return 'unknown'
  }
}
