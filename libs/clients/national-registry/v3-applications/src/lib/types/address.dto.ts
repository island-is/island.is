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

export const formatKerfiskennitalaAddressDto = (
  address:
    | {
        husHeiti: string | null
        ibud: string | null
        postnumer: string | null
        poststod: string | null
        sveitarfelag: string | null
        tegundHeimilisfangs: string | null
      }
    | null
    | undefined,
): AddressDto | null => {
  if (address == null) {
    return null
  }
  return {
    streetAddress: address.husHeiti ?? '',
    postalCode: address.postnumer ?? null,
    locality: address.sveitarfelag ?? null,
    municipalityNumber: null,
  }
}
