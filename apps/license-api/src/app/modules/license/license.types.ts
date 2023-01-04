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

export const CLIENT_FACTORY = 'client-factory'

export const DISABILITY_API = 'disability-api'
export const FIREARM_API = 'firearm-api'
