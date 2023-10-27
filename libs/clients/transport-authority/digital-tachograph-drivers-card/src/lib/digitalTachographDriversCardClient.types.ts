export interface TachoNetCheckRequest {
  firstName?: string
  lastName: string
  birthDate: Date
  birthPlace?: string
  drivingLicenceNumber?: string
  drivingLicenceIssuingCountry?: string
}

export interface NewestDriversCard {
  ssn?: string
  applicationCreatedAt?: Date
  cardNumber?: string
  cardValidFrom?: Date
  cardValidTo?: Date
  isValid?: boolean
}

export enum CardType {
  FIRST_EDITION = 'firstEdition',
  REISSUE = 'reissue',
  RENEWAL = 'renewal',
  REPRINT = 'reprint',
}

export interface DriversCardApplicationRequest {
  ssn: string
  fullName: string
  address: string
  postalCode: string
  place: string
  birthCountry: string
  birthPlace: string
  emailAddress?: string
  phoneNumber?: string
  deliveryMethodIsSend: boolean
  cardType: CardType
  paymentReceivedAt: Date
  photo: string
  signature: string
  driverslicenceNumber: string
  driverslicencePlaceOfPublication: string
  driverslicenceValidFrom: Date
  driverslicenceValidTo: Date
}

export interface IndividualPhotoAndSignature {
  ssn?: string | null
  photo?: string | null
  signature?: string | null
}
