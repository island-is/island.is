export type LICENSE_TYPE = 'DRIVERS_LICENSE' // | 'HUNTING_LICENSE'

export const PROVIDERS = {
  'national-police-commissioner': 'Ríkislögreglustjóri',
  // 'environment-agency': 'Umhverfisstofnun',
}

export const LICENSE_TITLES: Record<LICENSE_TYPE, string> = {
  DRIVERS_LICENSE: 'Ökuskírteini',
  // HUNTING_LICENSE: 'Veiðikort',
}

export const LICENSE_PROVIDERS: Record<LICENSE_TYPE, keyof typeof PROVIDERS> = {
  DRIVERS_LICENSE: 'national-police-commissioner',
  // HUNTING_LICENSE: 'environment-agency',
}

export type GenericLicenseFields = {
  licenseType: keyof typeof LICENSE_PROVIDERS
  title: string
  providerID: keyof typeof PROVIDERS
  provider: string
  providerLogo?: string
  pkpass: boolean
  timeout: number
  ordering: number
  backgroundImage?: string
  applicationUrl?: string
  detailUrl?: string
}

export type GenericUserLicenseFields = {
  licenseType: keyof typeof LICENSE_PROVIDERS
  nationalId: string
  expidationDate: Date
  issueDate: Date
  licenseStatus: 'HAS_LICENSE' | 'NOT_AVAILABLE'
  fetchStatus: 'FETCHED' | 'NOT_FETCHED' | 'FETCHING' | 'ERROR' | 'STALE'
  pkpassUrl: string
  payload: {
    data: GenericLicenseData
    rawData: any
  }
}

export type GenericLicenseDataField = {
  type: 'group' | 'category' | 'value';
  label: string;
  value: string;
  fields: Array<GenericLicenseDataField>;
}

export type GenericLicenseData = Array<GenericLicenseDataField>;
