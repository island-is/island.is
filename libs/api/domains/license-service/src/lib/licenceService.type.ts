// export type LICENSE_TYPE = 'DRIVERS_LICENSE' // | 'HUNTING_LICENSE'

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

/*
export const LICENSE_TITLES: Record<LICENSE_TYPE, string> = {
  DRIVERS_LICENSE: 'Ökuskírteini',
  // HUNTING_LICENSE: 'Veiðikort',
}

export const LICENSE_PROVIDERS: Record<LICENSE_TYPE, keyof typeof PROVIDERS> = {
  DRIVERS_LICENSE: 'national-police-commissioner',
  // HUNTING_LICENSE: 'environment-agency',
}
*/

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

export type GenericLicenseUserdata = {
  status: GenericUserLicenseStatus
}

export type GenericLicenseFetch = {
  status: GenericUserLicenseFetchStatus
  updated: string
}

// TODO(osk) document
export type GenericLicenseDataField = {
  type: GenericLicenseDataFieldType
  name?: string
  label?: string
  value?: string
  fields?: Array<GenericLicenseDataField>
}

export type GenericUserLicensePayload = {
  data: Array<GenericLicenseDataField>
  rawData: any
}

export type GenericUserLicense = {
  nationalId: string
  license: GenericLicenseMetadata & GenericLicenseUserdata
  fetch: GenericLicenseFetch
  pkpassUrl?: string
  payload?: GenericUserLicensePayload
}
