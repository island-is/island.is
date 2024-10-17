import { ConfigType } from '@island.is/nest/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpStatus, INestApplication } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { setupTestServer } from '../../../../test/setupTestServer'
import { BffConfig } from '../../bff.config'
import { IdsService } from '../ids/ids.service'
import {
  GetLoginSearchParamsReturnValue,
  ParResponse,
  TokenResponse,
} from '../ids/ids.types'

const SID_VALUE = 'fake_uuid'
const SESSION_COOKIE_NAME = 'sid'
const KID = 'test-kid'
const TEST_PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7uKPR7Gq2Cz3u
BDzUfTYirK6SaK9TnHD8KuOhCDp91j982NIivA/6SwfJhXAfqPdlbgxCsdk0R48E
ZwVuOCXbS4d4V39F+BpgEtuYelc56Ag0n3FuTpKgKiEQePkJSXzmgFD9W1ghXFNu
9cYmoPe7EfN7oFjZFCVn41ooztJZNpFyyJNnMR5m/IWKVPD4JGOjJDvfsyz17hP+
dKsbxKLstzh9ziBoLzrlq/N5AGdaaYTLr2dbMS1wiuCdESQkIRJw8yh8Emu3rtf4
X/p0VHbd/6MErxJE7OuPNnaJuc8D5Fc2vpQUTqoS6oY/THRVXdosbgAG19jwEGTY
31OYE2YbAgMBAAECggEADVZZHh7P41I/wRImmxEWw3aFMRxkXiqBy1cywavnfmEc
zqTko5iJnBNjoL/gNc4LK11nwpjtoTpdh21x/dRAbRwow/YxGHDZuUftt5/AypNZ
R3/cKJjgvKXYBo18+1nWZW9Qq2EnjR5vRE8MmCcDCUgFU09fsKcVR0dodJJi1vkb
cLFQExaU4kmcnvqxV2FazXuQaC8EbTtMcS6WHKNSCIYbd64hAcu906c7JgdC9Uvc
myaU0MLeb7WAlmN3Xpvyg6bCxwMLKjTdAr5p4J7/Tv/rimVPIOEsqI0NVP5Ajx/p
+w9kKanQ3L/7lt8+Q094U1iZ80zvBNh4XaAqUvhQQQKBgQDpDUMQHv29oilYiL73
+A70K4X2LptcH5fOGa/EHE8AeM9vlJm0HAnsOT+iERFsl6peD3bcoiyV84z72Q7P
WNddA+rynB4gBu8ymUS/CpXwZQSi33xxT55rB7hLJK+22udVDXzCrNcSQPd4Gwn3
lNqSUYf+8tv7Ub0Qm1R5lJYswQKBgQDONLEH3U/5aNV0/E0zcd0SVI9OtKu8qDxJ
J6v/P3bwbWvOmLRON4gFeAqK8awrYZd6Zupsdx15uqu/0Ikym/0C5bOzQa3E/9tT
vOZRoNch416J0AKY9wFemwxkDcheiOxSanP8PbNZPp0N86JehuXxy41guEu41qWZ
dDvrrpld2wKBgEqXZA+U28IGVRVxLy5Oxvp/s7DH2hHySrQ8pHUwWljcUgh0l31+
O+7Po/5LWDhZkr3oVTLo9TxJZ6Z0IrlaxhOPXXOpZDr7/TNEuywqRzNaIdG/liTu
RtYa8nGanGL6TXB7kKL+jxfYk1xtyxLjIdITJmQDd0VJNCpMjQ0c8bQBAoGBAKn3
/MRCxB0NMIWRQgFZpaPqV4XEnpqPAcI7FSb8JQng57APZu/iDhiT7fzBX+0SME4Q
bsKhHIauO8uMFMrGkTLGK+1iAd4UF7FaT26RaULhq5dlAf8b+uEEZJ5EThi+PC1i
2d/c6+xwE/zgCcJo5zj7U7mZr7DYHP/0Mz/9VyVpAoGBALvLo78LnijdHTf8mrWT
AlSQjhcJtHb1er4VKlPDF7p3hcVtrpgQaxnGL67DeLl4tt4dU4DoMMQKL/AyVDzI
gjQdXRT3AQDbB39P43an+11pXZOcyE1hCmW1VntOxY2DSD2GK45sh2eDQ6kuClbP
VIQ36zUj7NhPnYWM6aUHNLwA
-----END PRIVATE KEY-----
`

const TEST_PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu7ij0exqtgs97gQ81H02
IqyukmivU5xw/CrjoQg6fdY/fNjSIrwP+ksHyYVwH6j3ZW4MQrHZNEePBGcFbjgl
20uHeFd/RfgaYBLbmHpXOegINJ9xbk6SoCohEHj5CUl85oBQ/VtYIVxTbvXGJqD3
uxHze6BY2RQlZ+NaKM7SWTaRcsiTZzEeZvyFilTw+CRjoyQ737Ms9e4T/nSrG8Si
7Lc4fc4gaC865avzeQBnWmmEy69nWzEtcIrgnREkJCEScPMofBJrt67X+F/6dFR2
3f+jBK8SROzrjzZ2ibnPA+RXNr6UFE6qEuqGP0x0VV3aLG4ABtfY8BBk2N9TmBNm
GwIDAQAB
-----END PUBLIC KEY-----
`

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fake_uuid'),
}))

const validSigningKey = {
  kid: KID,
  alg: 'RS256',
  getPublicKey: jest.fn().mockReturnValue(TEST_PUBLIC_KEY),
}

const noMatchKidSigningKey = {
  kid: 'invalid-kid',
  alg: 'RS256',
  getPublicKey: jest.fn().mockReturnValue(TEST_PUBLIC_KEY),
}

const mockedSigningKeys = jest.fn().mockReturnValue([validSigningKey])

jest.mock('jwks-rsa', () => {
  return jest.fn().mockImplementation(() => ({
    getSigningKeys: mockedSigningKeys,
  }))
})

const mockCacheStore = new Map()

const mockCacheManagerValue = {
  set: jest.fn((key, value) => mockCacheStore.set(key, value)),
  get: jest.fn((key) => mockCacheStore.get(key)),
  del: jest.fn((key) => mockCacheStore.delete(key)),
}

const parResponse: ParResponse = {
  request_uri: 'urn:ietf:params:oauth:request_uri:abc123',
  expires_in: 600,
}

const tokensResponse: TokenResponse = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.mockSignature',
  id_token: jwt.sign(
    {
      iss: 'https://example.com',
      sub: '1234567890',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      sid: SID_VALUE,
    },
    'mockSecret',
    { algorithm: 'HS256' },
  ),
  refresh_token: 'mockRefreshToken1234567890',
  scope: 'openid profile email',
  token_type: 'Bearer',
  expires_in: 3600,
}

const allowedTargetLinkUri = 'http://test-client.com/testclient'

const mockIdsService = {
  getPar: jest.fn().mockResolvedValue({
    type: 'success',
    data: parResponse,
  }),
  getTokens: jest.fn().mockResolvedValue({
    type: 'success',
    data: tokensResponse,
  }),
  revokeToken: jest.fn().mockResolvedValue({
    type: 'success',
  }),
  getLoginSearchParams: jest.fn().mockImplementation(
    (args: {
      sid: string
      codeChallenge: string
      loginHint?: string
      prompt?: string
    }): GetLoginSearchParamsReturnValue => ({
      client_id: '@test_client_id',
      redirect_uri: 'http://localhost:3010/testclient/bff/callbacks/login',
      response_type: 'code',
      response_mode: 'query',
      scope: 'test_scope offline_access openid profile',
      state: SID_VALUE,
      code_challenge: 'test_code_challenge',
      code_challenge_method: 'test_code_challenge_method',
      ...(args.loginHint && { login_hint: args.loginHint }),
      ...(args.prompt && { prompt: args.prompt }),
    }),
  ),
}

describe('AuthController', () => {
  let app: INestApplication
  let server: request.SuperTest<request.Test>
  let mockConfig: ConfigType<typeof BffConfig>
  let baseUrlWithKey: string

  beforeAll(async () => {
    const app = await setupTestServer({
      override: (builder) =>
        builder
          .overrideProvider(CACHE_MANAGER)
          .useValue(mockCacheManagerValue)
          .overrideProvider(IdsService)
          .useValue(mockIdsService),
    })

    mockConfig = app.get<ConfigType<typeof BffConfig>>(BffConfig.KEY)
    baseUrlWithKey = `${mockConfig.clientBaseUrl}${process.env.BFF_CLIENT_KEY_PATH}`

    server = request(app.getHttpServer())
  })

  afterEach(() => {
    mockCacheStore.clear()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('GET /login', () => {
    it('should cache the login attempt', async () => {
      // Arrange
      const setSpy = jest.spyOn(mockCacheManagerValue, 'set')

      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(setSpy).toHaveBeenCalled()

      const [key, value] = setSpy.mock.calls[0]

      expect(key).toEqual(`attempt_${SID_VALUE}`)
      expect(value).toMatchObject({
        originUrl: baseUrlWithKey,
        codeVerifier: expect.any(String),
        targetLinkUri: allowedTargetLinkUri,
      })
    })

    it('should call login endpoint with correct parameters', async () => {
      // Arrange
      const expectedParams = {
        client_id: mockConfig.ids.clientId,
        response_type: 'code',
        response_mode: 'query',
        scope: 'test_scope offline_access openid profile',
        redirect_uri: mockConfig.callbacksRedirectUris.login,
        code_challenge_method: 'test_code_challenge_method',
      }

      const unknownValueParams = ['state', 'code_challenge']

      // Act
      const res = await server.get('/login')

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)

      // Check if the location header starts with the issuer ID
      expect(res.headers.location).toMatch(
        new RegExp(`^${mockConfig.ids.issuer}?`),
      )

      const url = new URL(res.headers.location)

      // Verify that each expected parameter is present
      for (const [key, value] of Object.entries(expectedParams)) {
        if (key === 'scope') {
          for (const scope of value.split(' ')) {
            expect(url.searchParams.get('scope')).toContain(scope)
          }
        } else {
          expect(url.searchParams.get(key)).toEqual(value)
        }
      }

      // Verify that each unknown value parameter is present
      for (const key of unknownValueParams) {
        expect(url.searchParams.get(key)).toBeDefined()
      }
    })

    it('should validate the query string param "target_link_uri" if not allowed', async () => {
      // Arrange
      const invalidTargetLinkUri = 'http://test-client.com/invalid'

      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Login failed!',
      })

      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: invalidTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should validate the query string param "target_link_uri" if allowed', async () => {
      // Act
      const res = await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(
        new RegExp(`^${mockConfig.ids.issuer}?`),
      )
    })

    it('should support PAR (Pushed Authorization Request) when enabled in config', async () => {
      // Arrange
      const parResponse: ParResponse = {
        request_uri: 'urn:ietf:params:oauth:request_uri:abc123',
        expires_in: 600,
      }

      const expectedParams = {
        request_uri: parResponse.request_uri,
        client_id: mockConfig.ids.clientId,
      }

      const redirectUrlSearchParams = new URLSearchParams(expectedParams)

      const app = await setupTestServer({
        override: (builder) =>
          builder
            .overrideProvider(IdsService)
            .useValue(mockIdsService)
            .overrideProvider(BffConfig.KEY)
            .useValue({
              ...mockConfig,
              parSupportEnabled: true,
            }),
      })

      const newServer = request(app.getHttpServer())
      const getParSpy = jest.spyOn(mockIdsService, 'getPar')

      // Act
      const res = await newServer.get('/login')

      // Assert
      expect(getParSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toEqual(
        `${
          mockConfig.ids.issuer
        }/connect/authorize?${redirectUrlSearchParams.toString()}`,
      )
    })
  })

  describe('GET /callbacks/login', () => {
    it('should redirect with error if invalid_request is present', async () => {
      // Arrange
      const idsError = 'Invalid request'
      const searchParams = new URLSearchParams({
        bff_error_code: '500',
        bff_error_description: idsError,
      })

      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server.get('/callbacks/login').query({
        invalid_request: idsError,
      })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should validate query string params and redirect with error if invalid', async () => {
      // Arrange
      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Login failed!',
      })
      const errorUrl = `${baseUrlWithKey}?${searchParams.toString()}`

      // Act
      const res = await server.get('/callbacks/login')

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    const scenarios = [
      {
        description:
          'should successfully finish callback login and redirect to fallback originUrl',
        targetLinkUri: undefined,
        expectedLocation: 'http://test-client.com/testclient',
      },
      {
        description:
          'should successfully finish callback login and redirect to target_link_uri query param',
        targetLinkUri: allowedTargetLinkUri,
        expectedLocation: allowedTargetLinkUri,
      },
    ]

    it.each(scenarios)(
      '$description',
      async ({ targetLinkUri, expectedLocation }) => {
        // Arrange
        const code = 'testcode'
        const getTokensSpy = jest.spyOn(mockIdsService, 'getTokens')
        const deleteCacheSpy = jest.spyOn(mockCacheManagerValue, 'del')
        const setCacheSpy = jest.spyOn(mockCacheManagerValue, 'set')
        const getCacheSpy = jest.spyOn(mockCacheManagerValue, 'get')

        // Act - First request to cache the login attempt
        await server
          .get('/login')
          .query(targetLinkUri ? { target_link_uri: targetLinkUri } : {})

        const loginAttempt = setCacheSpy.mock.calls[0]

        // Assert - First request should cache the login attempt
        expect(setCacheSpy.mock.calls[0]).toContain(`attempt_${SID_VALUE}`)
        expect(loginAttempt[1]).toMatchObject({
          originUrl: baseUrlWithKey,
          codeVerifier: expect.any(String),
          targetLinkUri,
        })

        // Then make a callback to the login endpoint
        const res = await server
          .get('/callbacks/login')
          .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
          .query({ code, state: SID_VALUE })

        const currentLogin = setCacheSpy.mock.calls[1]

        // Assert
        expect(setCacheSpy).toHaveBeenCalled()

        expect(currentLogin[0]).toContain(`current_${SID_VALUE}`)
        // Check if the cache contains the correct values for the current login
        expect(currentLogin[1]).toMatchObject(tokensResponse)

        expect(getCacheSpy).toHaveBeenCalled()
        expect(getTokensSpy).toHaveBeenCalled()
        expect(deleteCacheSpy).toHaveBeenCalled()

        expect(res.status).toEqual(HttpStatus.FOUND)

        // Should redirect to the expected location
        expect(res.headers.location).toEqual(expectedLocation)
      },
    )
  })

  describe('GET /logout', () => {
    it('should throw bad request if no sid query string is found', async () => {
      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })
      const res = await server.get('/logout')

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('should validate if no session cookie is found', async () => {
      // Act
      const res = await server.get('/logout').query({ sid: SID_VALUE })

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toEqual(mockConfig.logoutRedirectUri)
    })

    it('should redirect to logout redirect uri with error params if cookie and session state do not match', async () => {
      // Arrange
      const searchParams = new URLSearchParams({
        bff_error_code: '400',
        bff_error_description: 'Logout failed!',
      })

      const errorUrl = `${allowedTargetLinkUri}?${searchParams.toString()}`

      // Act
      const res = await server
        .get('/logout')
        .query({ sid: SID_VALUE })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=invalid_uuid`])

      // Assert
      expect(res.status).toEqual(HttpStatus.FOUND)
      expect(res.headers.location).toMatch(errorUrl)
    })

    it('should successfully logout and redirect to logout redirect uri', async () => {
      // Arrange
      const deleteCacheSpy = jest.spyOn(mockCacheManagerValue, 'del')
      const revokeRefreshTokenSpy = jest.spyOn(mockIdsService, 'revokeToken')
      const searchParams = new URLSearchParams({
        id_token_hint: tokensResponse.id_token,
        post_logout_redirect_uri: mockConfig.logoutRedirectUri,
      })

      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .get('/logout')
        .query({ sid: SID_VALUE })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(revokeRefreshTokenSpy).toHaveBeenCalled()
      expect(deleteCacheSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.FOUND)

      expect(res.headers.location).toEqual(
        `${
          mockConfig.ids.issuer
        }/connect/endsession?${searchParams.toString()}`,
      )
    })
  })

  describe('POST /callbacks/logout', () => {
    let tokenPayload: object

    beforeAll(() => {
      tokenPayload = {
        iss: mockConfig.ids.issuer,
        sub: '1234567890',
        exp: Math.floor(Date.now() / 1000) + 3600,
        sid: SID_VALUE,
      }
    })

    it('should throw 400 if logout_token is missing from body', async () => {
      // Act
      const res = await await server.post('/callbacks/logout')

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
      // Expect error to be
      expect(res.body).toMatchObject({
        statusCode: 400,
        message: 'No param "logout_token" provided!',
      })
    })

    it('should throw an error for a invalid logout_token, no matching key found for kid', async () => {
      // Arrange
      mockedSigningKeys.mockImplementationOnce(() => [noMatchKidSigningKey])

      const invalidToken = jwt.sign(tokenPayload, TEST_PRIVATE_KEY, {
        algorithm: 'RS256',
        header: { kid: KID },
      })

      // Act
      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: invalidToken })

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should throw an error for a invalid logout_token, no sid in the token', async () => {
      // Arrange
      const invalidToken = jwt.sign(
        {
          ...tokenPayload,
          sid: undefined,
        },
        TEST_PRIVATE_KEY,
        {
          algorithm: 'RS256',
          header: { kid: KID },
        },
      )

      // Act
      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: invalidToken })

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should return a 200 success response', async () => {
      // Arrange
      const validToken = jwt.sign(tokenPayload, TEST_PRIVATE_KEY, {
        algorithm: 'RS256',
        header: { kid: KID },
      })

      const getCacheSpy = jest.spyOn(mockCacheManagerValue, 'get')
      const revokeRefreshTokenSpy = jest.spyOn(mockIdsService, 'revokeToken')

      // Act
      await server
        .get('/login')
        .query({ target_link_uri: allowedTargetLinkUri })

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/callbacks/logout')
        .send({ logout_token: validToken })

      // Assert
      expect(getCacheSpy).toHaveBeenCalled()
      expect(revokeRefreshTokenSpy).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toMatchObject({
        status: 'success',
        message: 'Logout successful!',
      })
    })
  })
})
