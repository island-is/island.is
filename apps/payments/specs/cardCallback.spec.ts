/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from 'next'

import { sign } from 'jsonwebtoken'

import initApollo from '../graphql/client'
import handler from '../pages/api/card/callback'

jest.mock('../graphql/client', () => ({
  __esModule: true,
  default: jest.fn(),
}))

process.env.PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET = 'test-secret'

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed-token'),
}))

jest.mock('../graphql/mutations.graphql.generated', () => ({
  VerificationCallbackDocument: 'VerificationCallbackDocument',
  VerificationCallbackFailedDocument: 'VerificationCallbackFailedDocument',
}))

const SUCCESS_REDIRECT = '/greida/3ds'
const FAILURE_REDIRECT = '/greida/3ds?status=failed'
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

// A completed 3-D Secure authentication returns the cryptogram fields.
const completedAuthBody = {
  xid: 'xid-1',
  mdStatus: 'Y',
  MD: 'md-1',
  cavv: 'cavv-1',
  'TDS2.dsTransID': 'ds-1',
}

const mockMutate = jest.fn()

const createRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
  }
  return (res as unknown) as NextApiResponse & typeof res
}

const createReq = (overrides: Partial<NextApiRequest> = {}) =>
  (({
    method: 'POST',
    headers: { 'content-type': FORM_CONTENT_TYPE },
    body: completedAuthBody,
    ...overrides,
  } as unknown) as NextApiRequest)

describe('card verification callback handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;((initApollo as unknown) as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    })
    mockMutate.mockResolvedValue({ errors: undefined })
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    jest.spyOn(console, 'info').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('verifies a completed authentication and redirects to the success page with 303', async () => {
    const res = createRes()

    await handler(createReq(), res)

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith(303, SUCCESS_REDIRECT)
  })

  it('accepts a content-type that includes charset parameters', async () => {
    const res = createRes()

    await handler(
      createReq({
        headers: { 'content-type': `${FORM_CONTENT_TYPE}; charset=UTF-8` },
      }),
      res,
    )

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith(303, SUCCESS_REDIRECT)
  })

  it('reports a failed verification and redirects to the failure page (303) when cavv/dsTransID are missing', async () => {
    const res = createRes()

    // The ACS returned a non-authenticated result: mdStatus present, no cryptogram.
    await handler(
      createReq({
        body: {
          xid: 'xid-1',
          mdStatus: '96',
          MD: 'md-1',
          callbackSource: 'Fallback',
        },
      }),
      res,
    )

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        mutation: 'VerificationCallbackFailedDocument',
        variables: { input: { verificationToken: 'signed-token' } },
      }),
    )
    // Only the md and outcome fields are signed and passed on
    expect(sign).toHaveBeenCalledWith(
      {
        md: 'md-1',
        mdStatus: '96',
        callbackSource: 'Fallback',
        transStatus: undefined,
        transStatusReason: undefined,
      },
      'test-secret',
    )
    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('does not report a failed verification when the callback has no MD', async () => {
    const res = createRes()

    await handler(createReq({ body: { mdStatus: '96' } }), res)

    expect(mockMutate).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('still redirects to the failure page when reporting the failure fails', async () => {
    mockMutate.mockRejectedValue(new Error('network down'))
    const res = createRes()

    await handler(
      createReq({ body: { xid: 'xid-1', mdStatus: '96', MD: 'md-1' } }),
      res,
    )

    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('redirects to the failure page when the verification mutation fails with a network error', async () => {
    mockMutate.mockRejectedValue(new Error('network down'))
    const res = createRes()

    await handler(createReq(), res)

    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('redirects to the failure page when the verification mutation returns errors', async () => {
    mockMutate.mockResolvedValue({ errors: [{ message: 'boom' }] })
    const res = createRes()

    await handler(createReq(), res)

    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('redirects to the failure page on an unexpected content-type', async () => {
    const res = createRes()

    await handler(
      createReq({ headers: { 'content-type': 'application/json' } }),
      res,
    )

    expect(mockMutate).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('logs the 3DS outcome fields of an incomplete callback without sensitive data', async () => {
    const res = createRes()

    await handler(
      createReq({
        body: {
          xid: 'secret-xid',
          mdStatus: '96',
          MD: 'secret-md',
          callbackSource: 'Fallback',
          'TDS2.transStatus': 'U',
          'TDS2.transStatusReason': '14',
          cardholderInfo: 'Contact your bank at 555-0000',
        },
      }),
      res,
    )

    expect(console.error).toHaveBeenCalledWith(
      'Card verification callback: incomplete or invalid callback',
      expect.objectContaining({
        mdStatus: '96',
        callbackSource: 'Fallback',
        transStatus: 'U',
        transStatusReason: '14',
        missingFields: ['cavv', 'TDS2.dsTransID'],
      }),
    )
    const logged = JSON.stringify((console.error as jest.Mock).mock.calls)
    expect(logged).not.toContain('secret-xid')
    expect(logged).not.toContain('secret-md')
    expect(logged).not.toContain('555-0000')
    expect(res.redirect).toHaveBeenCalledWith(303, FAILURE_REDIRECT)
  })

  it('caps the length of logged outcome values', async () => {
    const res = createRes()

    await handler(createReq({ body: { mdStatus: 'x'.repeat(5000) } }), res)

    expect(console.error).toHaveBeenCalledWith(
      'Card verification callback: incomplete or invalid callback',
      expect.objectContaining({ mdStatus: 'x'.repeat(64) }),
    )
  })

  it('logs the 3DS outcome fields of a completed callback without sensitive data', async () => {
    const res = createRes()

    await handler(
      createReq({
        body: { ...completedAuthBody, callbackSource: 'Browser' },
      }),
      res,
    )

    expect(console.info).toHaveBeenCalledWith(
      'Card verification callback: received',
      expect.objectContaining({ mdStatus: 'Y', callbackSource: 'Browser' }),
    )
    const logged = JSON.stringify((console.info as jest.Mock).mock.calls)
    expect(logged).not.toContain(completedAuthBody.cavv)
    expect(logged).not.toContain(completedAuthBody.MD)
  })

  it('rejects non-POST requests with a 400 and does not redirect', async () => {
    const res = createRes()

    await handler(createReq({ method: 'GET' }), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
