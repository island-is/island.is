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

type DrivingLicenseCategory = {
  id: number
  issued: Date | null
  expires: Date | null
  nr?: string | null
}

export interface DrivingLicense {
  currentLicense: string | null
  categories?: DrivingLicenseCategory[]
  id?: number
  birthCountry: string
  publishPlaceName?: string | null
}

export interface QualityPhoto {
  dataUri: string
}

export interface QualitySignature {
  dataUri: string
}
