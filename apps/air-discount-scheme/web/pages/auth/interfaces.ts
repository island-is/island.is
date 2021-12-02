export interface User {
  nationalId: string
  name: string
  phoneNumber?: string
  service: string
  address?: Address
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
  municipalityCode: string
}