import { FetchError } from '@island.is/clients/middlewares'
import { ProblemError } from '@island.is/nest/problem'
import type { Problem } from '@island.is/shared/problem'

/**
 * Frigg answers a rejected key-info call with a machine-readable code
 * (`AGENT_EXISTS`, `IS_GUARDIAN`, `PERSON_NOT_FOUND`, … — contract v0.3 §6)
 * that the UI needs in order to explain the failure instead of showing "could
 * not save". A bare `FetchError` would reach the client as an unclassified 500
 * with nothing but a status, so the code and the request id are lifted onto
 * the problem the error filter serialises into `extensions.problem`.
 *
 * Contract v0.3 §6 fixes the body:
 *
 *     { "statusCode": 403, "code": "NOT_EDITABLE", "message": "…", "requestId": "…" }
 *
 * `requestId` is on every response and is the same value MMS records in its
 * own change log, so it is what a failure is quoted by when raised with MMS.
 *
 * None of this is in the generated client config — frigg's openapi document
 * describes no error responses at all — so the body stays untyped and is read
 * defensively, by name *and* shape. No code found means the original error is
 * rethrown untouched and the client falls back to its generic message, which
 * is also what the portal shows for a code it does not recognise.
 */

/**
 * Where the code lives (v0.3 §6). Only `code`: the body is documented, so
 * guessing at further names can only invent codes MMS never sent. In
 * particular a NestJS exception thrown without a code of its own serialises as
 * `{statusCode, message, error}` with the HTTP status text in `error`, which
 * would otherwise surface as an `mmsCode` of "Conflict".
 */
const CODE_KEYS = ['code']
/** Where the request id lives (v0.3 §6). */
const REQUEST_ID_KEYS = ['requestId']
/** Where the human-readable detail lives (v0.3 §6). */
const MESSAGE_KEYS = ['message']
/**
 * Ísland.is may send `X-Request-Id` itself, in which case MMS reuses it rather
 * than minting one (v0.3 §6). Read as a fallback for a rejection whose body
 * did not survive.
 */
const REQUEST_ID_HEADERS = ['x-request-id']

/**
 * What an MMS code looks like: `AGENT_EXISTS`, `PERSON_NOT_FOUND`, … (contract
 * v0.3 §6). The body is untyped, so the shape is checked as well as the field
 * name — a `code` field carrying a message, a status text or a number is not a
 * code, and an unrecognised body is better left to the generic message than
 * dressed up as one.
 */
const MMS_CODE_PATTERN = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/

const pickString = (
  body: Record<string, unknown>,
  keys: string[],
  pattern?: RegExp,
): string | undefined => {
  for (const key of keys) {
    const value = body[key]
    if (typeof value !== 'string' || value.length === 0) continue
    if (pattern && !pattern.test(value)) continue
    return value
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
  const mmsCode = pickString(body, CODE_KEYS, MMS_CODE_PATTERN)
  if (!mmsCode) return error

  const mmsRequestId =
    pickString(body, REQUEST_ID_KEYS) ?? requestIdFromHeaders(error)

  return new ProblemError(
    {
      status: error.status,
      type: `https://httpstatuses.org/${error.status}`,
      title: mmsCode,
      detail: pickString(body, MESSAGE_KEYS),
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
