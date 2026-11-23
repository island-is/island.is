/** The error codes of the API that callers act on. */
export enum EmploymentCertificateErrorCode {
  /** 409: the history changed after the applicant saw it. Fetch it again. */
  PreviewChanged = 'preview_changed',
}

/** Thrown before any request when the client's configuration can't be used. */
export class EmploymentCertificateClientNotConfiguredError extends Error {
  constructor(reason: string) {
    super(`The employment certificate client is not configured: ${reason}`)
    this.name = 'EmploymentCertificateClientNotConfiguredError'
  }
}

/** Thrown when the API answers with a success status but without a required value. */
export class EmploymentCertificateClientResultMissingError extends Error {
  constructor(operation: string, field: string) {
    super(
      `The employment certificate API returned no ${field} from ${operation}`,
    )
    this.name = 'EmploymentCertificateClientResultMissingError'
  }
}

export interface EmploymentCertificateClientProblem {
  status: number
  /** The API's error code, when it sends one. See EmploymentCertificateErrorCode. */
  code?: string
  /** The API's correlation ID for the call. Safe to log; never a case ID. */
  requestId?: string
}

interface FetchErrorLike {
  name?: unknown
  status?: unknown
  body?: unknown
  headers?: { get?: (name: string) => string | null }
  response?: { clone?: () => { json?: () => Promise<unknown> } }
}

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined

const readErrorBody = async (
  error: FetchErrorLike,
): Promise<Record<string, unknown> | undefined> => {
  let body = error.body
  if (body === undefined) {
    try {
      body = await error.response?.clone?.().json?.()
    } catch {
      // No JSON body, or it was already read.
      return undefined
    }
  }
  return body && typeof body === 'object'
    ? (body as Record<string, unknown>)
    : undefined
}

/**
 * The API's answer to a call that failed with a non-2xx response, or null when
 * there was no answer (timeouts, network errors, an open circuit breaker).
 *
 * The API answers errors with `{ code?, error, requestId }` as plain JSON. Only
 * `code` and `requestId` are returned; the free-text `error` is left out.
 *
 * The client throws `FetchError` for non-2xx responses. Duck typed so it also
 * holds when the class comes from another copy of the middlewares lib.
 */
export const getEmploymentCertificateClientProblem = async (
  error: unknown,
): Promise<EmploymentCertificateClientProblem | null> => {
  const e = error as FetchErrorLike | null | undefined

  if (e?.name !== 'FetchError' || typeof e.status !== 'number') {
    return null
  }

  const body = await readErrorBody(e)

  return {
    status: e.status,
    code: asString(body?.code),
    requestId:
      asString(body?.requestId) ??
      asString(e.headers?.get?.('x-request-id') ?? undefined),
  }
}

/** True when the history changed after the applicant saw it (409 `preview_changed`). */
export const isPreviewChanged = (
  problem: EmploymentCertificateClientProblem | null,
): boolean =>
  problem?.status === 409 &&
  problem.code === EmploymentCertificateErrorCode.PreviewChanged
