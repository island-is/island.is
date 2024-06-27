export type SelectedProperty = {
  propertyNumber: string
  propertyName: string
  propertyType: string
}

export interface MortgageCertificateValidation {
  propertyNumber: string
  exists: boolean
  hasKMarking: boolean
}

export type UserProfileData = {
  email: string
  mobilePhoneNumber: string
}

export type Address = {
  streetAddress: string
  city: string
  postalCode: string
}

export type IdentityData = {
  nationalId: string
  name: string
  address: Address
}
