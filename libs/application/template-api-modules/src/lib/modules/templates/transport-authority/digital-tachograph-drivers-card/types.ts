import { YesOrNo } from '@island.is/application/core'

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

export interface QualityPhotoAndSignature {
  photoDataUri: string
  signatureDataUri: string
}

export interface DigitalTachographFakeData {
  useFakeDataDriversCard?: YesOrNo
  hasNewestDriversCard?: YesOrNo
  newestDriversCardIsExpired?: YesOrNo
  newestDriversCardExpiresInMonths?: number
  newestDriversCardIsValid?: YesOrNo
}
