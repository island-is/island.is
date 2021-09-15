export enum GenericLicenseType {
  DriversLicense = 'DriversLicense',
  HuntingLicense = 'HuntingLicense',
}
export type GenericLicenseTypeType = keyof typeof GenericLicenseType

export enum GenericLicenseProviderId {
  NationalPoliceCommissioner = 'NationalPoliceCommissioner',
  EnvironmentAgency = 'EnvironmentAgency',
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

export type GenericLicenseDataField = {
  type: GenericLicenseDataFieldType
  name?: string
  label?: string
  value?: string
  fields?: Array<GenericLicenseDataField>
}

export type GenericUserLicensePayload = {
  data: Array<GenericLicenseDataField>
  rawData: unknown
}

export type GenericLicenseUserdata = {
  status: GenericUserLicenseStatus
}

// Bit of an awkward type, it contains data from any external API, but we don't know if it's
// too narrow or not until we bring in more licenses
export type GenericLicenseUserdataExternal = {
  status: GenericUserLicenseStatus
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

export type GenericUserLicense = {
  nationalId: string
  license: GenericLicenseMetadata & GenericLicenseUserdata
  fetch: GenericLicenseFetch
  payload?: GenericUserLicensePayload
}

export type PkPassVerificationError = {
  // Generic placeholder for a status code, could be the HTTP status code, code
  // from API, or empty string. Semantics need to be defined per license type
  status: string

  // Generic placeholder for a status message, from API, or empty "Unknown error".
  // Semantics need to be defined per license type
  message: string

  // data is used to pass along the error from originator, e.g. SmartSolution
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: unknown
}

export type PkPassVerification = {
  valid: boolean
  data?: string
  error?: PkPassVerificationError
}

/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient<LicenseType> {
  // This might be cached
  getLicense: (
    nationalId: string,
  ) => Promise<GenericLicenseUserdataExternal | null>

  // This will never be cached
  getLicenseDetail: (
    nationalId: string,
  ) => Promise<GenericLicenseUserdataExternal | null>

  getPkPassUrl: (
    nationalId: string,
    data?: LicenseType,
  ) => Promise<string | null>

  verifyPkPass: (data: string) => Promise<PkPassVerification | null>
}

export const GENERIC_LICENSE_FACTORY = 'generic_license_factory'

export const CONFIG_PROVIDER = 'config_provider'
