import { FetchError } from '@island.is/clients/middlewares'
import { ProblemError } from '@island.is/nest/problem'

import { toMmsKeyInfoProblem } from './mmsKeyInfoProblem'

/**
 * `FetchError` has a private constructor and is only built from a `Response`,
 * so the cases below are assembled from its public shape instead. The bodies
 * are the ones contract v0.3 §6 documents:
 *
 *     { "statusCode": 403, "code": "NOT_EDITABLE", "message": "…", "requestId": "…" }
 *
 * What the tests pin down is that those three fields are read and nothing else
 * is — see the module doc for why reading one field too many is worse than
 * reading one too few.
 */
const fetchError = ({
  status = 409,
  body,
  problem,
  headers = {},
}: {
  status?: number
  body?: unknown
  problem?: unknown
  headers?: Record<string, string>
} = {}): FetchError =>
  Object.assign(Object.create(FetchError.prototype), {
    name: 'FetchError',
    message: `Request failed with status code ${status}`,
    status,
    statusText: 'Conflict',
    url: 'https://frigg.test/me/children/child-1/emergency-contacts',
    body,
    problem,
    headers: new Headers(headers),
  }) as FetchError

const problemOf = (error: unknown) => {
  expect(error).toBeInstanceOf(ProblemError)
  return (error as ProblemError).problem as unknown as Record<string, unknown>
}

describe('toMmsKeyInfoProblem', () => {
  it('leaves anything that is not a FetchError alone', () => {
    const error = new Error('boom')

    expect(toMmsKeyInfoProblem(error)).toBe(error)
  })

  it('lifts the code, message and request id out of a rejection body', () => {
    const error = fetchError({
      body: {
        statusCode: 409,
        code: 'AGENT_EXISTS',
        message: 'Aðstandandi er þegar skráður á barnið',
        requestId: 'req-7f3c',
      },
    })

    const problem = problemOf(toMmsKeyInfoProblem(error))

    expect(problem).toMatchObject({
      status: 409,
      title: 'AGENT_EXISTS',
      detail: 'Aðstandandi er þegar skráður á barnið',
      mmsCode: 'AGENT_EXISTS',
      mmsRequestId: 'req-7f3c',
    })
  })

  it('reads a code served as application/problem+json', () => {
    const error = fetchError({
      status: 422,
      problem: {
        statusCode: 422,
        code: 'IS_GUARDIAN',
        message: 'Already a guardian of this child',
      },
    })

    expect(problemOf(toMmsKeyInfoProblem(error))).toMatchObject({
      mmsCode: 'IS_GUARDIAN',
      detail: 'Already a guardian of this child',
    })
  })

  it('reads only the documented field names', () => {
    // v0.3 §6 names `code`; anything else is a guess that could only invent a
    // code MMS never sent.
    const error = fetchError({
      body: { errorCode: 'AGENT_EXISTS', traceId: 'trace-1' },
    })

    expect(toMmsKeyInfoProblem(error)).toBe(error)
  })

  it('falls back to the request id from the response headers', () => {
    const error = fetchError({
      body: { code: 'NOT_EDITABLE' },
      headers: { 'x-request-id': 'req-from-header' },
    })

    expect(problemOf(toMmsKeyInfoProblem(error))).toMatchObject({
      mmsCode: 'NOT_EDITABLE',
      mmsRequestId: 'req-from-header',
    })
  })

  it('does not read a plain NestJS exception body as a code', () => {
    // What a Nest endpoint answers when it throws without a code of its own:
    // `error` is the HTTP status text, not an MMS code.
    const error = fetchError({
      body: {
        statusCode: 409,
        message: 'Contact already exists',
        error: 'Conflict',
      },
    })

    expect(toMmsKeyInfoProblem(error)).toBe(error)
  })

  it('ignores a code field that does not hold a code', () => {
    const error = fetchError({
      body: { code: 'Something went wrong', message: 'Something went wrong' },
    })

    expect(toMmsKeyInfoProblem(error)).toBe(error)
  })

  it('rethrows untouched when the body carries no code at all', () => {
    expect(toMmsKeyInfoProblem(fetchError({ body: undefined }))).toBeInstanceOf(
      FetchError,
    )
    expect(
      toMmsKeyInfoProblem(fetchError({ body: 'Bad Gateway' })),
    ).toBeInstanceOf(FetchError)
  })
})
