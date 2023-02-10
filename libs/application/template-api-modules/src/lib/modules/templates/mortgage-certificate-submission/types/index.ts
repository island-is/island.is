import {
  MortgageCertificateValidation,
  PropertyDetail,
} from '@island.is/clients/syslumenn'

export interface Address {
  streetAddress?: string
  city?: string
  postalCode?: string
}

export interface Identity {
  nationalId: string
  name: string
  address?: Address
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
