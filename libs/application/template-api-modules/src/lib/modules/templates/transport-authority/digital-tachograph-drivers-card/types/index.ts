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

export interface QualityPhoto {
  dataUri: string
}

export interface QualitySignature {
  dataUri: string
}
