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
  /** Unauthorized */
  | 6
  /** Forbidden */
  | 7
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

export const mapErrorToActionStatusCode = (
  exception?: string,
): ServiceErrorCode => {
  switch (exception) {
    case 'NotFoundException':
      return 3
    case 'IllegalArgumentException':
      return 4
    case 'InvalidDataException':
      return 4
    case 'ForbiddenException':
      return 7
    case 'UnauthorizedException':
      return 6
    case 'PersistenceException':
      return 13
    default:
      return 99
  }
}
