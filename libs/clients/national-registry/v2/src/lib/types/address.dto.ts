import { Heimilisfang } from '../../../gen/fetch'

export interface AddressDto {
  streetAddress: string
  postalCode: string | null
  locality: string | null
  municipalityNumber: string | null
}

export function formatAddressDto(
  address: Heimilisfang | null | undefined,
): AddressDto | null {
  if (address == null) {
    return null
  }

  return {
    streetAddress: address.heiti,
    postalCode: address.postnumer ?? null,
    locality: address.stadur ?? null,
    municipalityNumber: address.sveitarfelagsnumer ?? null,
  }
}
