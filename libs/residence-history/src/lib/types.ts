export interface Address {
  streetName?: string
  postalCode?: string
  city?: string
  municipalityCode?: string
}

export interface Residence {
  address: Address
  country: string
  dateOfChange: Date
}
