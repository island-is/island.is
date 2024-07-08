export interface RequestCorrection {
  hasSentRequest: boolean
}

export interface Address {
  streetAddress?: string
  city?: string
  postalCode?: string
}

export interface Properties {
  propertyNumber: string
  propertyType: string
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
