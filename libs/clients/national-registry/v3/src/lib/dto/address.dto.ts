import { EinstaklingurDTOHeimili } from '../../../gen/fetch'

export interface AddressDto {
  streetAddress: string
  apartment: string | null
  postalCode: string | null
  city: string | null
  municipality: string | null
  addressType: string | null
}

export function formatAddressDto(
  address?: EinstaklingurDTOHeimili | null,
): AddressDto | null {
  if (!address || !address.husHeiti) {
    return null
  }

  return {
    streetAddress: address.husHeiti,
    apartment: address.ibud ?? null,
    postalCode: address.postnumer ?? null,
    city: address.poststod ?? null,
    municipality: address.sveitarfelag ?? null,
    addressType: address.tegundHeimilisfangs ?? null,
  }
}
