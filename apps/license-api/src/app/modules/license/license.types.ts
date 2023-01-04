export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseStatus {
  EXPIRED = 'expired',
  OK = 'ok',
  REVOKED = 'revoked',
  NONE = 'none',
}

export enum LicenseId {
  FIREARM_LICENSE = 'FirearmLicense',
  DISABILITY_LICENSE = 'DisabilityLicense',
}

/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient {
  update: () => Promise<string | null>
  delete: () => Promise<string | null>
}

export const CLIENT_FACTORY = 'client-factory'
