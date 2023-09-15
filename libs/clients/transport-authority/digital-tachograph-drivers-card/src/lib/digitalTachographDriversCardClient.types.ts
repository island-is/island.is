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
  paymentReceivedAt: Date
  photo: string
  signature: string
}

export interface IndividualPhotoAndSignature {
  ssn?: string | null
  photo?: string | null
  signature?: string | null
}
