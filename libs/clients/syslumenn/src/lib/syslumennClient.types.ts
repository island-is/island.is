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
  auctionTakesPlaceAt: string
}

export interface DataUploadResponse {
  success: boolean
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
  type2?: string
  restaurantType?: string
  validFrom?: Date
  validTo?: Date
  licenseHolder?: string
  licenseResponsible?: string
  category?: string
  outdoorLicense?: string
  alcoholWeekdayLicense?: string
  alcoholWeekendLicense?: string
  alcoholWeekdayOutdoorLicense?: string
  alcoholWeekendOutdoorLicense?: string
  maximumNumberOfGuests?: number
  numberOfDiningGuests?: number
}

/**
 * The Syslumenn API provides pagination information in a custom header as a
 * JSON string. The OpenAPI specification currently does not define this object,
 * therefore we define it here.
 */
export interface SyslumennApiPaginationInfo {
  PageSize?: number
  PageNumber?: number
  TotalCount?: number
  TotalPages?: number
  CurrentPage?: number
  HasNext?: boolean
  HasPrevious?: boolean
}

export interface PaginationInfo {
  pageSize?: number
  pageNumber?: number
  totalCount?: number
  totalPages?: number
  currentPage?: number
  hasNext?: boolean
  hasPrevious?: boolean
}

export interface PaginatedOperatingLicenses {
  searchQuery: string
  paginationInfo: PaginationInfo
  results: OperatingLicense[]
}

export interface CertificateInfoResponse {
  nationalId?: string
  expirationDate?: string
  releaseDate?: string
}

export interface DistrictCommissionerAgencies {
  name: string
  place: string
  address: string
  id: string
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

export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
  CriminalRecordApplicant,
}

export enum AssetType {
  RealEstate = 0,
  Vehicle = 1,
  Ship = 2,
  Cash = 3,
  Flyer = 4,
}

export interface RealEstateAddress {
  address: string
}
