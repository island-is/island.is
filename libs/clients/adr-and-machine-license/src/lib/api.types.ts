export type ParsedApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ServiceError }

export type FetchResponse<T> = T | ErrorResponse

export type ErrorResponse = {
  type?: string
  title?: string
  status?: number
  traceId?: string
}

export interface ServiceError {
  /** Custom error code pertaining to the external service, or http status */
  code: ServiceErrorCode | number
  /** Custom message */
  message?: string
  /** Optional data */
  data?: string
}

/** ACTION CODES 1-10 *
 *  SERVICE CODES 10+ *
 * HTTP CODES 100+ */
export type ServiceErrorCode =
  /** License OK */
  | 1
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
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
