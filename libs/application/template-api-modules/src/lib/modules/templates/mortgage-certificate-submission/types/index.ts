import { MortgageCertificateValidation, PropertyDetail } from '@island.is/clients/syslumenn'

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

export interface UserProfile {
  email: string
  mobilePhoneNumber: string
}

export interface SubmitRequestToSyslumennResult {
  hasSentRequest: boolean
}

export interface ValidateMortgageCertificateResult {
  validation: MortgageCertificateValidation
  propertyDetails: PropertyDetail
}
