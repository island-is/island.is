import { User } from '@island.is/auth-nest-tools'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { Locale } from '@island.is/shared/types'

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
  /** External service error */
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
  ) => Promise<PkPassVerification | null>

  pushUpdatePass?: (
    inputData: PassDataInput,
    nationalId: string,
  ) => Promise<Result<Pass | undefined>>

  pullUpdatePass?: (nationalId: string) => Promise<Result<Pass | undefined>>

  revokePass?: (nationalId: string) => Promise<Result<RevokePassData>>

  verifyPass?: (
    inputData: string,
    nationalId: string,
  ) => Promise<Result<VerifyPassData>>
}

export const LICENSE_CLIENT_FACTORY = 'license-client-factory'

export const CONFIG_PROVIDER = 'config_provider'
