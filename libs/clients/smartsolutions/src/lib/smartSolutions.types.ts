import { Pass, PassTemplate } from '../../gen/schema'

/** Category to attach each log message to */
export const LOG_CATEGORY = 'smartsolutions'

export type ParsedApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ServiceError }

export type FetchResponse =
  /** Returns data if fetch executed */
  | { apiResponse: ApiResponse; error?: never }
  /** Returns an error if the function failed */
  | { apiResponse?: never; error: ServiceError }

export type ApiResponse = {
  data?: unknown
  errors?: {
    message: string
    path: string
  }[]
}

export interface ServiceError {
  /** Custom error code pertaining to the external service, or http status */
  code: ServiceErrorCode | number
  /** Custom message */
  message?: string
  /** Optional data */
  data?: string
}
/** VERIFY ACTION CODES 1-10 *
 *  SERVICE CODES 10+ *
 * HTTP CODES 100+ */
export type ServiceErrorCode =
  /** License OK */
  | 1
  /** License expired */
  | 2
  /** No/incomplete license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Invalid pass */
  | 5
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

export type Result<ResultType, ErrorType = ServiceError> =
  | {
      ok: true
      data: ResultType
    }
  | {
      ok: false
      error: ErrorType
    }

export interface VerifyPassData {
  valid: boolean
  pass?: Pass
}

export interface RevokePassData {
  success: boolean
}

export interface FindUserPassData {
  pass: Pass
}

export interface ListPassesResponseData {
  passes?: {
    data: Array<Pass>
  }
}

export interface GetPassResponseData {
  pass: Pass
}

export interface VerifyPassResponseData {
  updateStatusOnPassWithDynamicBarcode?: Pass
}

export interface UpsertPassResponseData {
  upsertPass: Pass
}

export interface UpdatePassResponseData {
  updatePass: Pass
}

export interface ListTemplatesResponseData {
  passes?: {
    data: Array<PassTemplate>
  }
}

export interface VoidPassResponseData {
  voidPass: boolean
}
export interface UnvoidPassResponseData {
  unvoidPass: boolean
}

export interface DeletePassResponseData {
  deletePass: boolean
}
