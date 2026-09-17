jest.mock('isomorphic-fetch', () => jest.fn())
jest.mock('@island.is/logging', () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}))

import fetch from 'isomorphic-fetch'
import { createWrappedFetchWithLogging } from './utils'

const mockFetch = fetch as unknown as jest.Mock

const requestInit = {
  body: JSON.stringify({
    applicationId: '1e0887a9',
    rightsCode: 'FO-FL-L-GR',
    applicant: '0102993019',
    email: 'applicant@example.is',
    periods: [{ from: '2027-01-01', to: '2027-01-15' }],
  }),
} as unknown as RequestInit

type VmstError = Error & {
  status?: number
  body?: Record<string, unknown>
}

const failWith = async (
  status: number,
  statusText: string,
  body: string,
): Promise<VmstError> => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    statusText,
    text: async () => body,
  })

  // `.then(onFulfilled, onRejected)` rather than `.catch`, so resolving is a
  // test failure with a readable message instead of a type union.
  return createWrappedFetchWithLogging('url', requestInit).then(
    () => {
      throw new Error('expected the wrapper to reject, but it resolved')
    },
    (e) => e as VmstError,
  )
}

describe('createWrappedFetchWithLogging', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should resolve the response when VMST is happy', async () => {
    const response = { ok: true, status: 200, statusText: 'OK' }
    mockFetch.mockResolvedValue(response)

    await expect(
      createWrappedFetchWithLogging('url', requestInit),
    ).resolves.toBe(response)
  })

  // Regression: this used to `reject(requestBody)`, so callers were handed the
  // payload they had just sent and the reason VMST refused it was lost.
  it('should reject with the failure rather than the request that caused it', async () => {
    const error = await failWith(
      400,
      'Bad Request',
      JSON.stringify({ errorCode: 'PL-1234' }),
    )

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('400 Bad Request')
    expect(error.message).toContain('PL-1234')
    expect(error.status).toBe(400)
  })

  it('should spell out the field errors of a ProblemDetails body', async () => {
    const error = await failWith(
      400,
      'Bad Request',
      JSON.stringify({
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: { employers: ['The employers field is required.'] },
      }),
    )

    expect(error.message).toContain('One or more validation errors occurred.')
    expect(error.message).toContain(
      'employers: The employers field is required.',
    )
  })

  // A 500 from X-Road in front of VMST arrives as HTML, and used to be dropped
  // on the floor, leaving a bare status with no reason at all.
  it('should fall back to the body text when the error is not JSON', async () => {
    const error = await failWith(
      500,
      'Server Error',
      '<html><body><h1>Server Error</h1>\n  <p>Object reference not set</p></body></html>',
    )

    expect(error.message).toContain('500 Server Error')
    expect(error.message).toContain('Object reference not set')
  })

  it('should collapse and cap a long body', async () => {
    const error = await failWith(500, 'Server Error', 'x'.repeat(1000))

    expect(error.message.length).toBeLessThan(400)
    expect(error.message).toContain('…')
  })

  it('should still report the status when there is no body at all', async () => {
    const error = await failWith(502, 'Bad Gateway', '')

    expect(error.message).toBe('502 Bad Gateway')
  })

  it('should keep request data out of the rejection', async () => {
    const error = await failWith(
      400,
      'Bad Request',
      JSON.stringify({ errorCode: 'X' }),
    )

    expect(error.message).not.toContain('applicant@example.is')
    expect(error.message).not.toContain('0102993019')
  })
})
