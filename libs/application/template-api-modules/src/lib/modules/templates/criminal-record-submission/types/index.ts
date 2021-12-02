export interface Address {
  streetAddress: string
  postalCode: string
  city: string
}

export interface Person {
  nationalId: string
  fullName: string
  address: Address
}

export interface NationalRegistry extends Person {}

export interface UserProfile {
  email: string
  mobilePhoneNumber: string
}
