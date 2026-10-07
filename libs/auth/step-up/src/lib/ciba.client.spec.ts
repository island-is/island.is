import { generateKeyPairSync } from 'crypto'
import { sign } from 'jsonwebtoken'

import { CibaClient } from './ciba.client'
import { isCardSession } from './types'

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
})

jest.mock('jwks-rsa', () => ({
  JwksClient: jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn().mockResolvedValue({
      getPublicKey: () => publicKey.export({ type: 'spki', format: 'pem' }),
    }),
  })),
}))

const issuer = 'https://innskra.island.is'
const clientId = '@island.is/clients/step-up'

const options = {
  issuer,
  clientId,
  clientSecret: 'secret',
  scope: 'openid @island.is/auth/step-up',
  requiredAcr: 'eidas-loa-high',
}

const issueToken = (claims: Record<string, unknown> = {}) =>
  sign(
    {
      client_id: clientId,
      sub: 'subject-1',
      nationalId: '0101302989',
      acr: 'eidas-loa-high',
      amr: ['swk', 'pin'],
      auth_time: 1_800_000_000,
      ...claims,
    },
    privateKey,
    { algorithm: 'RS256', keyid: 'key-1', issuer, expiresIn: 300 },
  )

const respond = (status: number, json: Record<string, unknown>) =>
  jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(json), { status }))

const sentForm = (fetchMock: jest.SpyInstance) =>
  new URLSearchParams(String(fetchMock.mock.calls[0][1].body))

describe('isCardSession', () => {
  it.each([
    [['hwk', 'sc', 'pin'], true],
    [['hwk', 'pin'], false],
    [['swk', 'pin'], false],
    [undefined, false],
  ])('%j → %s', (amr, expected) => {
    expect(isCardSession(amr)).toBe(expected)
  })
})

describe('CibaClient', () => {
  afterEach(() => jest.restoreAllMocks())

  describe('start', () => {
    it("names the person only through the user's own token", async () => {
      // Arrange
      const fetchMock = respond(200, {
        auth_req_id: 'req-1',
        expires_in: 300,
        interval: 5,
        verification_code: '4821',
        login_method: 'sim',
      })

      // Act
      const started = await new CibaClient(options).start({
        userToken: 'Bearer user-access-token',
        bindingMessage: 'Opna heilsu í appinu',
        contextHash: 'abc123',
      })

      // Assert
      expect(fetchMock.mock.calls[0][0]).toBe(`${issuer}/connect/ciba`)
      const form = sentForm(fetchMock)
      expect(form.get('login_hint_token')).toBe('user-access-token')
      expect(form.has('login_hint')).toBe(false)
      expect(form.get('binding_message')).toBe('Opna heilsu í appinu')
      expect(form.get('acr_values')).toBe('eidas-loa-high')
      expect(form.has('login_method')).toBe(false)
      expect(form.has('login_method_hint')).toBe(false)
      expect(form.get('context_hash')).toBe('abc123')
      expect(form.get('client_id')).toBe(clientId)
      expect(started).toEqual({
        authReqId: 'req-1',
        method: 'sim',
        expiresIn: 300,
        interval: 5,
        verificationCode: '4821',
      })
    })

    it('refuses to start without a client secret', async () => {
      await expect(
        new CibaClient({ ...options, clientSecret: '' }).start({
          userToken: 'token',
          bindingMessage: 'x',
        }),
      ).rejects.toThrow('no client secret')
    })

    it('reports why the identity server refused', async () => {
      respond(400, { error: 'unknown_user_id' })

      await expect(
        new CibaClient(options).start({ userToken: 't', bindingMessage: 'x' }),
      ).rejects.toThrow('unknown_user_id')
    })
  })

  describe('poll', () => {
    it.each([
      ['authorization_pending', 'pending'],
      ['slow_down', 'pending'],
      ['access_denied', 'denied'],
      ['expired_token', 'expired'],
      ['invalid_grant', 'expired'],
    ])('maps %s to %s', async (error, status) => {
      respond(400, { error })

      await expect(new CibaClient(options).poll('req-1')).resolves.toEqual({
        status,
      })
    })

    it('returns what the verified token vouches for', async () => {
      respond(200, {
        access_token: issueToken({ step_up_context_hash: 'abc123' }),
      })

      const result = await new CibaClient(options).poll('req-1')

      expect(result).toEqual({
        status: 'authenticated',
        claims: {
          sub: 'subject-1',
          nationalId: '0101302989',
          acr: 'eidas-loa-high',
          amr: ['swk', 'pin'],
          authTime: new Date(1_800_000_000 * 1000),
          certificateThumbprint: undefined,
          contextHash: 'abc123',
        },
      })
    })

    it('refuses a token issued to another client', async () => {
      respond(200, { access_token: issueToken({ client_id: 'someone-else' }) })

      await expect(new CibaClient(options).poll('req-1')).rejects.toThrow(
        'different client',
      )
    })

    it('refuses a token from another issuer', async () => {
      respond(200, {
        access_token: sign(
          { client_id: clientId, sub: 's', nationalId: 'n', auth_time: 1 },
          privateKey,
          { algorithm: 'RS256', keyid: 'key-1', issuer: 'https://evil' },
        ),
      })

      await expect(new CibaClient(options).poll('req-1')).rejects.toThrow(
        'jwt issuer invalid',
      )
    })

    it('refuses a token without an authentication time', async () => {
      respond(200, { access_token: issueToken({ auth_time: undefined }) })

      await expect(new CibaClient(options).poll('req-1')).rejects.toThrow(
        'when the person authenticated',
      )
    })
  })
})
