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
  publishText: string
  auctionTakesPlaceAt: string
}

export interface RealEstateAgent {
  name: string
  location: string
}

export interface Lawyer {
  name: string
  licenceType: string
}

export interface Broker {
  name: string
  nationalId: string
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

export interface OperatingLicensesCSV {
  value: string
}

export interface AlcoholLicence {
  licenceType?: string
  licenceSubType?: string
  licenseNumber?: string
  issuedBy?: string
  year?: number
  validFrom?: Date
  validTo?: Date
  licenseHolder?: string
  licenseResponsible?: string
  office?: string
  location?: string
}

export interface TemporaryEventLicence {
  licenceType?: string
  licenceSubType?: string
  licenseNumber?: string
  issuedBy?: string
  year?: number
  validFrom?: Date
  validTo?: Date
  licenseHolder?: string
  licenseResponsible?: string
  maximumNumberOfGuests?: number
  estimatedNumberOfGuests?: number
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
  MortgageCertificateApplicant,
  AnnouncerOfDeathCertificate,
}

export interface MortgageCertificate {
  contentBase64: string
  apiMessage?: string | undefined
}

export interface MortgageCertificateValidation {
  propertyNumber: string
  isFromSearch?: boolean
  exists: boolean
  hasKMarking: boolean
}

export enum AssetType {
  RealEstate = 0,
  Vehicle = 1,
  Ship = 2,
  Cash = 3,
  Flyer = 4,
}

export type AssetName = {
  name: string
}

export type Advocate = {
  nationalId: string
  name: string
  address?: string
  phone?: string
  email?: string
}

export type EstateMember = {
  name: string
  nationalId: string
  relation: string
  relationWithApplicant?: string
  dateOfBirth?: string
  enabled?: boolean
  phone?: string
  email?: string
  advocate?: Advocate
}

export type EstateAsset = {
  description: string
  assetNumber: string
  share: number
  enabled?: boolean
  marketValue?: string
}

export interface EstateRegistrant extends EstateCommon {
  applicantEmail: string
  applicantPhone: string
  office: string
  ownBusinessManagement: boolean
  assetsAbroad: boolean
  occupationRightViaCondominium: boolean
  bankStockOrShares: boolean
}

export type EstateRelations = {
  relations: string[]
}

interface EstateCommon {
  assets: EstateAsset[]
  vehicles: EstateAsset[]
  ships: EstateAsset[]
  flyers: EstateAsset[]
  cash: EstateAsset[]
  guns: EstateAsset[]
  estateMembers: EstateMember[]
  caseNumber: string
  districtCommissionerHasWill: boolean
  marriageSettlement: boolean
  dateOfDeath: Date
  nameOfDeceased: string
  nationalIdOfDeceased: string
  knowledgeOfOtherWills: 'Yes' | 'No'
}

export interface EstateInfo extends EstateCommon {
  addressOfDeceased: string
}

// Copied from propertyDetails in @island.is/api/domains/assets. Only properties in use
export interface PropertyDetail {
  defaultAddress?: PropertyLocation
  propertyNumber?: string
  unitsOfUse?: UnitsOfUseModel
}

interface PropertyLocation {
  display?: string
}

interface UnitsOfUseModel {
  unitsOfUse?: UnitsOfUse[]
}

interface UnitsOfUse {
  explanation?: string
}

export interface MasterLicence {
  name?: string
  dateOfPublication?: Date
  profession?: string
  office?: string
}
