export interface PersonResidenceChange {
  id: string
  name: string
  ssn: string
  postalCode: string
  address: string
  city: string
}

export interface UserInfo {
  email: string
  emailVerified: boolean
  mobilePhoneNumber: string
  mobilePhoneNumberVerified: boolean
}
