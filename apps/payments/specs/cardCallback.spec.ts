/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from 'next'

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
  return res as unknown as NextApiResponse & typeof res
}

const createReq = (overrides: Partial<NextApiRequest> = {}) =>
  ({
    method: 'POST',
    headers: { 'content-type': FORM_CONTENT_TYPE },
    body: completedAuthBody,
    ...overrides,
  } as unknown as NextApiRequest)

describe('card verification callback handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(initApollo as unknown as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    })
    mockMutate.mockResolvedValue({ errors: undefined })
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
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

  it('redirects to the failure page (303) without verifying when cavv/dsTransID are missing', async () => {
    const res = createRes()

    // The ACS returned a non-authenticated result: mdStatus present, no cryptogram.
    await handler(
      createReq({ body: { xid: 'xid-1', mdStatus: 'N', MD: 'md-1' } }),
      res,
    )

    expect(mockMutate).not.toHaveBeenCalled()
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

  it('rejects non-POST requests with a 400 and does not redirect', async () => {
    const res = createRes()

    await handler(createReq({ method: 'GET' }), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
