export interface AddressDto {
  address: string
  town?: string
  postalCode?: number
  country?: string
}

export const mapAddressDto = (
  address?: string,
  town?: string,
  postalCode?: number,
  country?: string,
): AddressDto | null => {
  if (!address) {
    return null
  }

  return {
    address,
    town: town ?? undefined,
    postalCode: postalCode ?? undefined,
    country: country ?? undefined,
  }
}
