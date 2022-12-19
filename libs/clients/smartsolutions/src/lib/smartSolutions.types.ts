export type ServiceResponse<ResponseType> = {
  data?: ResponseType
  errors?: {
    message: string
    path: string
  }[]
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

export type FetchResponse<T> =
  | {
      data: T
      error?: never
    }
  | {
      data?: never
      error: ServiceError
    }

export interface ServiceError {
  serviceCode: ErrorCode
  message?: string
  httpStatus?: {
    status: number
    statusText: string
  }
}

export type ErrorCode =
  /** Missing Pass Template id */
  | 1
  /** Fetch failed */
  | 2
  /** JSON parse failed */
  | 3
  /** External service error */
  | 4
  /** Incomplete service response */
  | 5
  /** Request contains some field errors */
  | 6
  /** Generic error code */
  | 99
