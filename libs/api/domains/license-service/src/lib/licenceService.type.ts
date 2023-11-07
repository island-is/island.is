import { User } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

export enum GenericLicenseType {
  DriversLicense = 'DriversLicense',
  HuntingLicense = 'HuntingLicense',
  AdrLicense = 'AdrLicense',
  MachineLicense = 'MachineLicense',
  FirearmLicense = 'FirearmLicense',
  DisabilityLicense = 'DisabilityLicense',
  PCard = 'PCard',
  Ehic = 'Ehic',
}

/**
 * Get organization slug from the CMS.
 * https://app.contentful.com/spaces/8k0h54kbe6bj/entries?id=kc7049zAeHdJezwG&contentTypeId=organization
 * */
export enum GenericLicenseOrganizationSlug {
  DriversLicense = 'rikislogreglustjori',
  FirearmLicense = 'rikislogreglustjori',
  HuntingLicense = 'umhverfisstofnun',
  AdrLicense = 'vinnueftirlitid',
  MachineLicense = 'vinnueftirlitid',
  DisabilityLicense = 'tryggingastofnun',
  PCard = 'syslumenn',
  EHIC = 'sjukratryggingar-islands',
}
export type GenericLicenseTypeType = keyof typeof GenericLicenseType

export enum GenericLicenseProviderId {
  NationalPoliceCommissioner = 'NationalPoliceCommissioner',
  EnvironmentAgency = 'EnvironmentAgency',
  AdministrationOfOccupationalSafetyAndHealth = 'AdministrationOfOccupationalSafetyAndHealth',
  SocialInsuranceAdministration = 'SocialInsuranceAdministration', // Tryggingastofnun
  DistrictCommissioners = 'DistrictCommissioners', // Sýslumenn
  IcelandicHealthInsurance = 'IcelandicHealthInsurance', // Sjúkratryggingar Íslands
}

export type GenericLicenseProviderIdType = keyof typeof GenericLicenseProviderId

export enum GenericUserLicenseStatus {
  Unknown = 'Unknown',
  HasLicense = 'HasLicense',
  NotAvailable = 'NotAvailable',
}

export enum GenericUserLicenseFetchStatus {
  Fetched = 'Fetched',
  NotFetched = 'NotFetched',
  Fetching = 'Fetching',
  Error = 'Error',
  Stale = 'Stale',
}

export enum GenericLicenseDataFieldType {
  Group = 'Group',
  Category = 'Category',
  Value = 'Value',
  Table = 'Table',
}

export enum GenericUserLicensePkPassStatus {
  Available = 'Available',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

export enum GenericUserLicenseMetaLinksType {
  External = 'External',
  Download = 'Download',
}

export type GenericLicenseProvider = {
  id: GenericLicenseProviderId

  // TODO(osk) should these be here? or be resolved by client via contentful?
  // Commented out until talked about, to limit scope of v1
  /*
  name: string
  logo?: string
  */
}

export type GenericLicenseMetadata = {
  type: GenericLicenseType
  provider: GenericLicenseProvider
  pkpass: boolean
  pkpassVerify: boolean
  timeout: number
  orgSlug?: GenericLicenseOrganizationSlug

  // TODO(osk) should these be here? or be resolved by client via contentful?
  // Commented out until talked about, to limit scope of v1
  /*
  title: string
  ordering: number
  backgroundImage?: string
  applicationUrl?: string
  detailUrl?: string
  */
}

export type GenericLicenseOrgdata = {
  title?: string
  logo?: string
}

export type GenericLicenseDataField = {
  type: GenericLicenseDataFieldType
  name?: string
  label?: string
  value?: string
  description?: string
  //if any functionality comes attached to said data field, f.x. renewLicense
  link?: GenericUserLicenseMetaLinks
  hideFromServicePortal?: boolean
  fields?: Array<GenericLicenseDataField>
}

export type GenericUserLicenseMetaLinks = {
  label?: string
  value?: string
  type?: GenericUserLicenseMetaLinksType
}

export type GenericUserLicenseMetadata = {
  links?: GenericUserLicenseMetaLinks[]
  licenseNumber: string
  expired: boolean | null
  expireDate?: string
}

export type GenericUserLicensePayload = {
  data: Array<GenericLicenseDataField>
  rawData: unknown
  metadata?: GenericUserLicenseMetadata
}

export type GenericLicenseUserdata = {
  status: GenericUserLicenseStatus
  pkpassStatus: GenericUserLicensePkPassStatus
}

export type GenericLicenseFetchResult = {
  data: unknown
  fetch: GenericLicenseFetch
}

// Bit of an awkward type, it contains data from any external API, but we don't know if it's
// too narrow or not until we bring in more licenses
export type GenericLicenseUserdataExternal = {
  status: GenericUserLicenseStatus
  pkpassStatus: GenericUserLicensePkPassStatus
  payload?: GenericUserLicensePayload | null
}

export type GenericLicenseFetch = {
  status: GenericUserLicenseFetchStatus
  updated: Date
}

export type GenericLicenseCached = {
  data: GenericLicenseUserdata | null
  fetch: GenericLicenseFetch
  payload?: GenericUserLicensePayload
}

export type LicenseLabelsObject = {
  [x: string]: string
}

export type GenericLicenseLabels = {
  labels?: LicenseLabelsObject
}

export type GenericUserLicense = {
  nationalId: string
  license: GenericLicenseMetadata &
    GenericLicenseUserdata &
    GenericLicenseOrgdata &
    GenericLicenseLabels
  fetch: GenericLicenseFetch
  payload?: GenericUserLicensePayload
}

export type GenericLicensePkPassResult = {
  valid?: boolean
  url?: string
}

export type PkPassVerificationError = {
  /**
   * Generic placeholder for a status code, could be the HTTP status code, code
   * from API, or empty string. Semantics need to be defined per license type
   */
  status: string

  /**
   * Generic placeholder for a status message, from API, or empty "Unknown error".
   * Semantics need to be defined per license type
   */
  message: string

  /**
   * data is used to pass along the error from originator, e.g. SmartSolution
   */
  data?: string
}

export type PassTemplateIds = {
  firearmLicense: string
  adrLicense: string
  machineLicense: string
  disabilityLicense: string
  drivingLicense: string
}

export type PkPassVerificationData = {
  id?: string
  validFrom?: string
  expirationDate?: string
  expirationTime?: string
  status?: string
  whenCreated?: string
  whenModified?: string
  alreadyPaid?: boolean
}

export type PkPassVerification = {
  valid: boolean
  data?: string
  error?: PkPassVerificationError
}

export type PkPassVerificationInputData = {
  code: string
  date: string
}

/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient<LicenseType> {
  // This might be cached
  getLicense: (
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ) => Promise<GenericLicenseUserdataExternal | null>

  // This will never be cached
  getLicenseDetail: (
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ) => Promise<GenericLicenseUserdataExternal | null>

  getPkPassUrl: (
    user: User,
    data?: LicenseType,
    locale?: Locale,
  ) => Promise<string | null>

  getPkPassQRCode: (
    user: User,
    data?: LicenseType,
    locale?: Locale,
  ) => Promise<string | null>

  verifyPkPass: (
    data: string,
    passTemplateId: string,
  ) => Promise<PkPassVerification | null>
}

export interface GenericLicenseMapper {
  parsePayload: (
    payload?: unknown,
    locale?: Locale,
    labels?: GenericLicenseLabels,
  ) => GenericUserLicensePayload | null
}

export const DRIVING_LICENSE_FACTORY = 'driving_license_factory'

export const LICENSE_MAPPER_FACTORY = 'license-mapper-factory'

export const GENERIC_LICENSE_FACTORY = 'generic_license_factory'

export const CONFIG_PROVIDER = 'config_provider'
