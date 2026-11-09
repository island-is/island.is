import { FetchError } from '@island.is/clients/middlewares'
import { ProblemError } from '@island.is/nest/problem'
import type { Problem } from '@island.is/shared/problem'

/**
 * Frigg answers a rejected key-info call with a machine-readable code
 * (`AGENT_EXISTS`, `IS_GUARDIAN`, `PERSON_NOT_FOUND`, … — contract v0.2 §5) that
 * the UI needs in order to explain the failure instead of showing "could not
 * save". A bare `FetchError` would reach the client as an unclassified 500 with
 * nothing but a status, so the code — and the request id, when frigg sends one —
 * is lifted onto the problem the error filter serialises into
 * `extensions.problem`.
 *
 * The error body is not part of the generated client config, so every field is
 * read defensively: no code found means the original error is rethrown
 * untouched and the client falls back to its generic message.
 */

/** Field names an MMS error body may carry the code under. */
const CODE_KEYS = ['code', 'errorCode', 'error']
/** Field names an MMS error body may carry its request id under. */
const REQUEST_ID_KEYS = ['requestId', 'request_id', 'traceId']
/** Response headers a request id may arrive in instead of the body. */
const REQUEST_ID_HEADERS = ['x-request-id', 'x-correlation-id']

const pickString = (
  body: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = body[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return undefined
}

const errorBody = (error: FetchError): Record<string, unknown> => {
  const body = error.problem ?? error.body
  return body !== null && typeof body === 'object'
    ? (body as Record<string, unknown>)
    : {}
}

const requestIdFromHeaders = (error: FetchError): string | undefined => {
  for (const header of REQUEST_ID_HEADERS) {
    const value = error.headers?.get(header)
    if (value) return value
  }
  return undefined
}

/**
 * A {@link ProblemError} carrying the MMS code, or the original error when the
 * response held no code to carry.
 */
export const toMmsKeyInfoProblem = (error: unknown): unknown => {
  if (!(error instanceof FetchError)) return error

  const body = errorBody(error)
  const mmsCode = pickString(body, CODE_KEYS)
  if (!mmsCode) return error

  const mmsRequestId =
    pickString(body, REQUEST_ID_KEYS) ?? requestIdFromHeaders(error)

  return new ProblemError(
    {
      status: error.status,
      type: `https://httpstatuses.org/${error.status}`,
      title: mmsCode,
      detail: pickString(body, ['message', 'detail', 'title']),
      mmsCode,
      mmsRequestId,
    } as unknown as Problem,
    { cause: error },
  )
}

/** Runs a frigg key-info call, translating its failures for the client. */
export const withMmsKeyInfoProblem = async <T>(
  call: () => Promise<T>,
): Promise<T> => {
  try {
    return await call()
  } catch (error) {
    throw toMmsKeyInfoProblem(error)
  }
}
