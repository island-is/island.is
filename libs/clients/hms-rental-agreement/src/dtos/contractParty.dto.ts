import { AddressDto, mapAddressDto } from './address.dto'
import { ContractParty as GeneratedContractParty } from '../../gen/fetch'
import { PartyType } from '../types'

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
  data: GeneratedContractParty,
): ContractPartyDto | null => {
  const contractPartyId = data?.contractPartyId ?? undefined

  if (contractPartyId === undefined || !data.partyTypeUseCode || !data.name) {
    return null
  }
  return {
    id: contractPartyId,
    type: mapPartyType(data.partyTypeUseCode),
    name: data.name ?? undefined,
    nationalId: data.kennitala ?? undefined,
    address:
      mapAddressDto(
        data.address1 ?? undefined,
        data.town ?? undefined,
        data.postalCode ?? undefined,
        data.country ?? undefined,
      ) ?? undefined,
    phoneNumber: data.phoneNumber ?? undefined,
    email: data.email ?? undefined,
  }
}

const mapPartyType = (type?: string): PartyType => {
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
