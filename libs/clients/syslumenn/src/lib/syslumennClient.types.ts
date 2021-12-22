

export interface SyslumennAuction {
  office: string
  location: string
  auctionType: string
  lotType: string
  lotName: string
  lotId: string
  lotItems: string
  auctionDate: string
  auctionTime: string
  petitioners: string
  respondent: string
}

export interface DataUploadResponse {
  message?: string
  id?: string
  caseNumber?: string
}

export interface Homestay {
  registrationNumber: string
  name: string
  address: string
  manager: string
  year?: number
  city: string
  guests?: number
  rooms?: number
  propertyId: string
  apartmentId: string
}

export interface OperatingLicense {
  id?: number
  issuedBy?: string
  licenseNumber?: string
  location?: string
  name?: string
  street?: string
  postalCode?: string
  type?: string
  validUntil?: string
  licenseHolder?: string
  category?: string
  outdoorLicense?: string
  alcoholWeekdayLicense?: string
  alcoholWeekendLicense?: string
  alcoholWeekdayOutdoorLicense?: string
  alcoholWeekendOutdoorLicense?: string
}

export interface CertificateInfoRepsonse {
  nationalId?: string
  expirationDate?: string
  releaseDate?: string
}

export interface DistrictCommissionersAgenciesRepsonse {
  name?: string
  place?: string
  address?: string
  id?: string
}

export interface Person {
  name: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress: string
  postalCode: string
  city: string
  signed: boolean
  type: number
}

export interface Attachment {
  name: string
  content: string
}

