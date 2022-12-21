export type FetchResponse<T> =
  /** Returns data if fetch executed */
  | { apiResponse: ApiResponse<T>; error?: never }
  /** Returns an error if the function failed */
  | { apiResponse?: never; error: ServiceError }

export type ApiResponse<ResponseType> = {
  data?: ResponseType
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
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
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
/*
function ui(result: Result<Array<PassTemplate>>) {
  if (result.ok && result.data.length > 0) {
    // til skírteini
  } else if (result.ok && result.data.length === 0) {
    // á ekki skírteini
  } else if (!result.ok) {
    // ökusk á cut-off date fyrir mynd
    if (result.error.canBeDisplayedToUser) {
      return 'of gamalt ökusk'
    } else {
      return 'villa kom upp'
    }
  }
}
*/
