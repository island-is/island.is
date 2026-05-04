export interface AddressDto {
  address: string
  town?: string
  postalCode?: number
  country?: string
}

export const mapAddressDto = (
  address?: string | null,
  town?: string | null,
  postalCode?: number | null,
  country?: string | null,
): AddressDto | null => {
  if (!address) return null
  return {
    address,
    town: town ?? undefined,
    postalCode: postalCode ?? undefined,
    country: country ?? undefined,
  }
}
