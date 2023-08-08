import { User } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

export type LicenseLabelsObject = {
  [x: string]: string
}

export enum LicenseType {
  FirearmLicense = 'FirearmLicense',
  AdrLicense = 'AdrLicense',
  MachineLicense = 'MachineLicense',
  DisabilityLicense = 'DisabilityLicense',
  DriversLicense = 'DriversLicense',
}

export type LicenseTypeType = keyof typeof LicenseType

export enum LicensePkPassAvailability {
  Available = 'Available',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

export type PassTemplateIds = {
  firearmLicense: string
  adrLicense: string
  machineLicense: string
  disabilityLicense: string
  driversLicense: string
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
}

export type PkPassVerificationInputData = {
  code: string
  date: string
}

export type VerifyInputData = {
  code: string
  date: string
  passTemplateName?: string
  passTemplateId?: string
}

export type PassVerificationData = {
  valid: boolean
  passIdentity?: {
    name: string
    nationalId: string
    picture?: string
  }
}

export type Result<ResultType, ErrorType = ServiceError> =
  | {
      ok: true
      data: ResultType
    }
  | {
      ok: false
      error: ErrorType
    }

export interface ServiceError {
  /** Custom error code pertaining to the external service, or http status */
  code: number
  /** Custom message */
  message?: string
  /** Optional data */
  data?: string
}

/** SERVICE CODES 10+ *
 *  HTTP CODES 100+ */
export type ServiceErrorCode =
  /** Pass unavailable for pkpass generation */
  | 2
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Invalid pass */
  | 5
  /** Driving license pkPass generation failed */
  | 6
  /** Missing PassTemplateId */
  | 10
  /** Fetch failed */
  | 11
  /** JSON parse failed */
  | 12
  /** Service error */
  | 13
  /** Incomplete service response */
  | 14
  /** Request contains some field errors */
  | 15
  /** Generic error code / Unknown */
  | 99

export interface LicenseClient<ResultType> {
  // This might be cached
  getLicense: (user: User) => Promise<Result<ResultType | null>>

  // This will never be cached
  getLicenseDetail: (user: User) => Promise<Result<ResultType | null>>

  licenseIsValidForPkPass: (payload: unknown) => LicensePkPassAvailability

  getPkPassUrl: (user: User, locale?: Locale) => Promise<Result<string>>

  getPkPassQRCode: (user: User, locale?: Locale) => Promise<Result<string>>

  verifyPkPass: (
    data: string,
    passTemplateId: string,
  ) => Promise<Result<PkPassVerification>>
}

export const LICENSE_CLIENT_FACTORY = 'license-client-factory'
export const LICENSE_UPDATE_CLIENT_FACTORY = 'license-client-factory'

export const CONFIG_PROVIDER = 'config_provider'
