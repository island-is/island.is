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

export interface NationalRegistryBirthplace {
  location: string
}

export interface DrivingLicense {
  id?: number
  birthCountry: string
  issued?: Date | null
  expires?: Date | null
  publishPlaceName?: string | null
}

export interface QualityPhoto {
  dataUri: string
}

export interface QualitySignature {
  dataUri: string
}
