import { FetchError } from '@island.is/clients/middlewares'
import {
  getEmploymentCertificateClientProblem,
  isPreviewChanged,
} from './employment-certificate.errors'

const jsonError = (status: number, body: unknown, headers = {}) =>
  FetchError.buildMock(
    { status, headers: { 'content-type': 'application/json', ...headers } },
    JSON.stringify(body),
  )

describe('getEmploymentCertificateClientProblem', () => {
  it('reads the code and request ID of a 409 preview_changed', async () => {
    const error = await jsonError(409, {
      code: 'preview_changed',
      error: 'preview changed',
      requestId: 'request-1',
    })

    // As in the module's setup, the error doesn't carry the body, so the
    // helper has to read it from the response.
    expect(error.body).toBeUndefined()

    const problem = await getEmploymentCertificateClientProblem(error)

    expect(problem).toEqual({
      status: 409,
      code: 'preview_changed',
      requestId: 'request-1',
    })
    expect(isPreviewChanged(problem)).toBe(true)
  })

  it('never returns the free-text error', async () => {
    const error = await jsonError(400, {
      code: 'invalid_request',
      error: 'free text from the API',
      requestId: 'request-2',
    })

    const problem = await getEmploymentCertificateClientProblem(error)

    expect(JSON.stringify(problem)).not.toContain('free text')
  })

  it('handles a 401, which has no code', async () => {
    const error = await jsonError(401, {
      error: 'unauthorized',
      requestId: 'request-3',
    })

    const problem = await getEmploymentCertificateClientProblem(error)

    expect(problem).toEqual({
      status: 401,
      code: undefined,
      requestId: 'request-3',
    })
    expect(isPreviewChanged(problem)).toBe(false)
  })

  it('falls back to the X-Request-ID header', async () => {
    const error = await FetchError.buildMock(
      { status: 413, headers: { 'x-request-id': 'request-4' } },
      'Request Entity Too Large',
    )

    await expect(getEmploymentCertificateClientProblem(error)).resolves.toEqual(
      {
        status: 413,
        code: undefined,
        requestId: 'request-4',
      },
    )
  })

  it('uses a body that is already on the error', async () => {
    await expect(
      getEmploymentCertificateClientProblem({
        name: 'FetchError',
        status: 409,
        body: { code: 'preview_changed', requestId: 'request-5' },
      }),
    ).resolves.toEqual({
      status: 409,
      code: 'preview_changed',
      requestId: 'request-5',
    })
  })

  it('does not treat another 409 as a changed preview', async () => {
    const error = await jsonError(409, { code: 'something_else' })

    const problem = await getEmploymentCertificateClientProblem(error)

    expect(problem?.status).toBe(409)
    expect(isPreviewChanged(problem)).toBe(false)
  })

  it.each([
    ['a timeout', Object.assign(new Error('timeout'), { name: 'AbortError' })],
    ['a plain error', new Error('network')],
    ['a FetchError without a status', { name: 'FetchError' }],
    ['null', null],
    ['undefined', undefined],
  ])('returns null for %s', async (_name, error) => {
    await expect(
      getEmploymentCertificateClientProblem(error),
    ).resolves.toBeNull()
    expect(isPreviewChanged(null)).toBe(false)
  })
})
