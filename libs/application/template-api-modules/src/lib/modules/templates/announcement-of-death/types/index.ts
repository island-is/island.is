export interface Address {
  streetAddress: string
  postalCode: string
  city: string
}

export interface NationalRegistry {
  nationalId: string
  fullName: string
  address: Address
}

export interface RealEstateAddress {
  address: string
  /*
  addressNumber: number
  landNumber: number
  postalCode: number
  municipality: string
  display: string
  displayShort: string
  */
}
