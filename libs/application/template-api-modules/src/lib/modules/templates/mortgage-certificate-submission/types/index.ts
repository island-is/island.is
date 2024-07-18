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

export interface SelectedProperty {
  propertyNumber: string
  propertyName: string
  propertyType: string
}
