export interface TachoNetCheckRequest {
  firstName?: string
  lastName: string
  birthDate: Date
  birthPlace?: string
  drivingLicenceNumber?: string
  drivingLicenceIssuingCountry?: string
}

export interface TachoNetCheckResponse {
  firstName?: string
  lastName?: string
  birthDate?: string
  birthPlace?: string
  drivingLicenceNumber?: string
  drivingLicenceIssuingCountry?: string
  cards?: Array<TachoNetCheckResponseCard>
}

export interface TachoNetCheckResponseCard {
  countryName?: string
  cardNumber?: string
  cardValidFrom?: string
  cardValidTo?: string
  issuingAuthority?: string
  isTemporary?: boolean
  isActive?: boolean
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

export interface DriverCardApplicationResponse {
  ssn?: string
  applicationCreatedAt?: string
  cardNumber?: string
  cardValidFrom?: string
  cardValidTo?: string
  deliveryMethodIsSend?: boolean
  deliveryAddressIfSend?: DriverCardApplicationResponseDeliveryAddress
}

export interface DriverCardApplicationResponseDeliveryAddress {
  recipientName?: string
  address?: string
  postalCode?: string
  place?: string
  country?: string
}

export interface PhotoAndSignatureResponse {
  ssn?: string
  photo?: string
  signature?: string
}
