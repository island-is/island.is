/**
 * Delegation types supported by the syslumenn VirkUmbod API endpoint.
 * Used to specify the type of delegation when checking if a delegation exists.
 */
export enum SyslumennDelegationType {
  LegalRepresentative = 'LegalRepresentative',
  PersonalRepresentative = 'PersonalRepresentative',
}

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
  location?: string
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
  name?: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress?: string
  postalCode?: string
  city?: string
  signed: boolean
  type: number
}

export interface RegistryPerson {
  name: string
  nationalId: string
  address: string
  postalCode: string
  city: string
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
  propertyNumber?: string | undefined
}

export interface MortgageCertificateValidation {
  propertyNumber: string
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
  noContactInfo?: ('Yes' | 'No')[]
  enabled?: boolean
  phone?: string
  email?: string
  advocate?: Advocate
  advocate2?: Advocate
}

export type InheritanceEstateMember = EstateMember & {
  address?: string
  heirsPercentage?: string
}

export type EstateAsset = {
  description: string
  assetNumber: string
  share: number
  enabled?: boolean
  marketValue?: string
  // Additional fields for specific asset types
  upphaed?: string // Face value for stocks
  gengiVextir?: string // Exchange rate for stocks
  exchangeRateOrInterest?: string // Interest/exchange rate for bank accounts
}

export type AvailableSettlements = {
  estateWithoutAssets: string
  officialDivision: string
  permitForUndividedEstate: string
  divisionOfEstateByHeirs: string
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
  moneyAndDeposit: EstateAsset[]
  guns: EstateAsset[]
  otherAssets: EstateAsset[]
  otherDebts?: Array<EstateAsset & { debtType: DebtTypes }>
  estateMembers: EstateMember[]
  caseNumber: string
  districtCommissionerHasWill?: boolean
  marriageSettlement?: boolean
  dateOfDeath: Date
  nameOfDeceased: string
  nationalIdOfDeceased: string
  knowledgeOfOtherWills?: 'Yes' | 'No'
}

interface EstateCommonWithBankAccounts extends EstateCommon {
  bankAccounts: EstateAsset[]
  claims: EstateAsset[]
  stocks: EstateAsset[]
  inventory?: {
    info: string
    value: string
  }
}

export interface EstateInfo extends EstateCommonWithBankAccounts {
  addressOfDeceased: string
  availableSettlements?: AvailableSettlements
}

export interface InheritanceTax {
  validFrom: Date
  inheritanceTax: number
  taxExemptionLimit: number
}

export interface InheritanceReportAsset {
  description?: string
  assetNumber?: string
  share: number
  propertyValuation?: string
  debtType?: DebtTypes
  amount: string
  exchangeRateOrInterest: string
}

export const FuneralAssetItem = {
  Casket: 0, // Smíði kistu og umbúnaður
  Announcements: 1, // Dánartilkynningar
  Printing: 2,
  Flowers: 3,
  Music: 4,
  Venue: 5,
  Wake: 6,
  Tombstone: 7,
  FuneralServices: 8,
  Cremation: 9,
  Other: 10,
} as const

export type FuneralAssetItem =
  typeof FuneralAssetItem[keyof typeof FuneralAssetItem]

export interface InheritanceReportFuneralAsset extends InheritanceReportAsset {
  funeralAssetItem: FuneralAssetItem
}

export interface InheritanceReportInfo {
  assets: Array<InheritanceReportAsset>
  vehicles: Array<InheritanceReportAsset>
  ships: Array<InheritanceReportAsset>
  cash: Array<InheritanceReportAsset>
  flyers: Array<InheritanceReportAsset>
  otherAssets: Array<InheritanceReportAsset>
  stocks: Array<InheritanceReportAsset>
  bankAccounts: Array<InheritanceReportAsset>
  depositsAndMoney: Array<InheritanceReportAsset>
  guns: Array<InheritanceReportAsset>
  sharesAndClaims: Array<InheritanceReportAsset>
  funeralCosts: Array<InheritanceReportFuneralAsset>
  officialFees: Array<InheritanceReportAsset>
  otherDebts: Array<InheritanceReportAsset>
  assetsInBusiness: Array<InheritanceReportAsset>
  debtsInBusiness: Array<InheritanceReportAsset>
  heirs: Array<EstateMember>
  caseNumber?: string
  dateOfDeath?: Date
  will?: string
  settlement?: boolean
  knowledgeOfOtherWill?: boolean
  nationalId?: string
  addressOfDeceased?: string
  nameOfDeceased?: string
  inheritanceTax?: InheritanceTax
}

// Copied from propertyDetails in @island.is/api/domains/assets. Only properties in use
export interface PropertyDetail {
  defaultAddress?: PropertyLocation
  propertyNumber?: string
  unitsOfUse?: UnitsOfUseModel
}

export interface ManyPropertyDetail {
  propertyNumber?: string
  propertyType?: string
  realEstate?: Array<RealEstateDetail>
  vehicle?: VehicleDetail
  ship?: ShipDetail
}

export interface RealEstateDetail {
  propertyNumber: string
  usage: string
  defaultAddress: string
}

export interface VehicleDetail {
  licencePlate: string
  propertyNumber: string
  manufacturer: string
  manufacturerType: string
  color: string
  dateOfRegistration: Date
}

export interface ShipDetail {
  shipRegistrationNumber: string
  usageType: string
  name: string
  initialRegistrationDate: Date
  mainMeasurements: ShipMeasurements
}

interface ShipMeasurements {
  length: string
  bruttoWeightTons: string
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
  nationalId?: string
}

export interface JourneymanLicence {
  name?: string
  dateOfPublication?: Date
  profession?: string
  nationalId?: string
}

export interface ProfessionRight {
  name?: string
  profession?: string
  nationalId?: string
}

export interface BurningPermit {
  dateFrom?: Date | null
  timeFrom?: string | null
  dateTo?: Date | null
  timeTo?: string | null
  type?: string | null
  subtype?: string | null
  responsibleParty?: string | null
  office?: string | null
  licensee?: string | null
  place?: string | null
  size?: number | null
}

export interface ReligiousOrganization {
  director?: string | null
  name: string
  homeAddress?: string | null
  postalCode?: string | null
  municipality?: string | null
}

export interface VehicleRegistration {
  modelName?: string
  manufacturer?: string
  licensePlate?: string
  color?: string
}

export enum DebtTypes {
  Overdraft = 'overdraft',
  CreditCard = 'creditCard',
  Duties = 'duties',
  Loan = 'loan',
  InsuranceCompany = 'insuranceCompany',
  PropertyFees = 'propertyFees',
  OtherDebts = 'otherDebts',
}

export interface DrivingInstructor {
  name: string
  postalCode: string
  municipality: string
}
