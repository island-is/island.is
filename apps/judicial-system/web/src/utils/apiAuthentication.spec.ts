import { sign } from 'jsonwebtoken'
import type { NextApiRequest } from 'next'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import type { Credentials } from '@island.is/judicial-system/types'

import { authenticateApiRequest } from './apiAuthentication'

const secret = 'test-secret'

const buildRequest = (token?: string, authorization?: string): NextApiRequest =>
  ({
    cookies: token ? { [ACCESS_TOKEN_COOKIE_NAME]: token } : {},
    headers: authorization ? { authorization } : {},
  } as unknown as NextApiRequest)

const buildToken = (
  credentials: Partial<Credentials> = {},
  signingSecret = secret,
  expiresIn = '1h',
) =>
  sign({ currentUserNationalId: '0101010101', ...credentials }, signingSecret, {
    expiresIn,
  })

describe('authenticateApiRequest', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, AUTH_JWT_SECRET: secret }
    delete process.env.ENVIRONMENT
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should accept a valid token', () => {
    const user = authenticateApiRequest(buildRequest(buildToken()))

    expect(user?.currentUserNationalId).toBe('0101010101')
  })

  it('should accept a valid token that carries a csrf token when it is echoed back', () => {
    const user = authenticateApiRequest(
      buildRequest(buildToken({ csrfToken: 'csrf' }), 'Bearer csrf'),
    )

    expect(user?.currentUserNationalId).toBe('0101010101')
  })

  it('should refuse a request without a token', () => {
    expect(authenticateApiRequest(buildRequest())).toBeUndefined()
  })

  it('should refuse a token signed with another secret', () => {
    expect(
      authenticateApiRequest(buildRequest(buildToken({}, 'another-secret'))),
    ).toBeUndefined()
  })

  it('should refuse a token that is not a token at all', () => {
    expect(authenticateApiRequest(buildRequest('not-a-token'))).toBeUndefined()
  })

  it('should refuse an expired token', () => {
    expect(
      authenticateApiRequest(buildRequest(buildToken({}, secret, '-1s'))),
    ).toBeUndefined()
  })

  it('should refuse a token whose csrf token is not echoed back', () => {
    expect(
      authenticateApiRequest(buildRequest(buildToken({ csrfToken: 'csrf' }))),
    ).toBeUndefined()
  })

  it('should refuse a token whose csrf token is echoed back wrongly', () => {
    expect(
      authenticateApiRequest(
        buildRequest(buildToken({ csrfToken: 'csrf' }), 'Bearer other'),
      ),
    ).toBeUndefined()
  })

  it('should refuse a token for no user', () => {
    expect(
      authenticateApiRequest(
        buildRequest(sign({ csrfToken: 'csrf' }, secret), 'Bearer csrf'),
      ),
    ).toBeUndefined()
  })

  describe('when AUTH_JWT_SECRET is missing', () => {
    it('should refuse every request in a deployed environment', () => {
      delete process.env.AUTH_JWT_SECRET
      process.env.ENVIRONMENT = 'prod'

      // Notably a token signed with the development default, which is public.
      expect(
        authenticateApiRequest(buildRequest(buildToken({}, 'jwt-secret'))),
      ).toBeUndefined()
    })

    it('should fall back to the development secret locally', () => {
      delete process.env.AUTH_JWT_SECRET

      const user = authenticateApiRequest(
        buildRequest(buildToken({}, 'jwt-secret')),
      )

      expect(user?.currentUserNationalId).toBe('0101010101')
    })
  })
})
