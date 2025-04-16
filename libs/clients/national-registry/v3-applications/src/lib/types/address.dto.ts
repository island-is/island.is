import { HeimilisfangBaseDTO } from '../../../gen/fetch'

export interface AddressDto {
  streetAddress: string
  postalCode: string | null
  locality: string | null
  municipalityNumber: string | null
}

export const formatAddressDto = (
  address: HeimilisfangBaseDTO | null | undefined,
): AddressDto | null => {
  if (address == null) {
    return null
  }

  return {
    streetAddress: address.heimilisfang ?? '',
    postalCode: address.postnumer ?? null,
    locality: address.stadur ?? null,
    municipalityNumber: address.sveitarfelagsnumer ?? null,
  }
}
