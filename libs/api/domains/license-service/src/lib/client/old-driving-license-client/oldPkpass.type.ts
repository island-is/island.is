import { OldGenericDrivingLicenseResponse } from './oldGenericDrivingLicense.type'

export type OldPkPassPayload = OldGenericDrivingLicenseResponse & {
  faedingardagur: string
}

export interface OldPkPassServiceTokenResponse {
  status?: number
  message?: string
  data?: {
    ACCESS_TOKEN: string
    GENERATED_ON: {
      date: string
      timezone_type: number
      timezone: string
    }
    EXPIRED_ON: string
  }
}

export interface OldPkPassServiceDriversLicenseResponse {
  message: string
  data?: {
    pass_url: string
    pass_qrcode: string
  }
  status: number
}

/**
 * Driving licenses are verified against SmartSolution API
 * https://app.gitbook.com/@smartsolutions/s/smart-solutions-drivers-license/verify-drivers-license
 */

export type OldPkPassServiceVerifyDriversLicenseStatusCode =
  /** License OK */
  | 1
  /** License expired */
  | 2
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Unknown error */
  | 99

/** Data for a response with errors */
export interface OldPkPassServiceErrorResponse {
  message?: string
  status?: OldPkPassServiceVerifyDriversLicenseStatusCode
  data?: unknown
}

/** Data for a successful response */
export interface OldPkPassServiceVerifyDriversLicenseResponse {
  message: string
  data?: {
    kennitala?: string
  }
  status: OldPkPassServiceVerifyDriversLicenseStatusCode
}

/** Wrapper for error passed along to clients */
export interface OldPkPassVerifyError {
  /**
   * HTTP status code from the service.
   * Needed while `status` was always the same, use `serviceError.status` for
   * error reported by API.
   */
  statusCode: number
  serviceError?: OldPkPassServiceErrorResponse
}

/** Wrapper for data passed along to clients */
export interface OldPkPassVerifyResult {
  valid: boolean
  error?: OldPkPassVerifyError
  nationalId?: string
}
