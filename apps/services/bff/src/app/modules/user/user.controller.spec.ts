import { ConfigType } from '@island.is/nest/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request from 'supertest'

import { setupTestServer } from '../../../../test/setupTestServer'
import {
  SESSION_COOKIE_NAME,
  SID_VALUE,
  getLoginSearchParmsFn,
  mockedTokensResponse as tokensResponse,
} from '../../../../test/sharedConstants'
import { environment } from '../../../environment'
import { BffConfig } from '../../bff.config'
import { TokenRefreshService } from '../auth/token-refresh.service'
import { IdsService } from '../ids/ids.service'

const mockCacheStore = new Map()

const mockCacheManagerValue = {
  set: jest.fn((key, value) => mockCacheStore.set(key, value)),
  get: jest.fn((key) => mockCacheStore.get(key)),
  del: jest.fn((key) => mockCacheStore.delete(key)),
}

const generateTokenTimestamps = (baseTime = 1700000000) => {
  const now = baseTime

  return {
    iat: now,
    exp: now + 3600,
  }
}

const { iat, exp } = generateTokenTimestamps()

const mockUserProfile = {
  sub: '1234567890',
  iss: 'https://example.com',
  sid: SID_VALUE,
  iat,
  exp,
}

const mockCachedTokenResponse = {
  ...tokensResponse,
  scopes: ['openid', 'profile', 'email'],
  userProfile: mockUserProfile,
  accessTokenExp: Date.now() + 3600000,
  encryptedAccessToken: 'encrypted.access.token',
  encryptedRefreshToken: 'encrypted.refresh.token',
}

const mockTokenRefreshService = {
  refreshToken: jest.fn().mockResolvedValue(mockCachedTokenResponse),
}

const mockIdsService = {
  getTokens: jest.fn().mockResolvedValue(mockCachedTokenResponse),
  revokeToken: jest.fn().mockResolvedValue(undefined),
  getLoginSearchParams: jest.fn().mockImplementation(getLoginSearchParmsFn),
}

const createLoginAttempt = (mockConfig: ConfigType<typeof BffConfig>) => ({
  originUrl: `${mockConfig.clientBaseUrl}${environment.keyPath}`,
  codeVerifier: 'test_code_verifier',
  targetLinkUri: undefined,
})

describe('UserController', () => {
  let app: INestApplication
  let server: request.SuperTest<request.Test>
  let mockConfig: ConfigType<typeof BffConfig>

  beforeAll(async () => {
    app = await setupTestServer({
      override: (builder) =>
        builder
          .overrideProvider(CACHE_MANAGER)
          .useValue(mockCacheManagerValue)
          .overrideProvider(TokenRefreshService)
          .useValue(mockTokenRefreshService)
          .overrideProvider(IdsService)
          .useValue(mockIdsService),
    })

    mockConfig = app.get<ConfigType<typeof BffConfig>>(BffConfig.KEY)
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

  describe('GET /user', () => {
    it('should throw unauthorized exception when sid cookie is not provided', async () => {
      // Act
      const res = await server.get('/user')

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should throw unauthorized exception when cache key is not found', async () => {
      // Act
      const res = await server
        .get('/user')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should return user data when valid session exists', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(`attempt_${SID_VALUE}`, createLoginAttempt(mockConfig))

      // Initialize session with login
      await server.get('/login')
      const callbackRes = await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      expect(callbackRes.status).toBe(HttpStatus.FOUND)

      // Act - Get user data
      const res = await server
        .get('/user')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({
        scopes: ['openid', 'profile', 'email'],
        profile: expect.objectContaining({
          ...mockUserProfile,
          iat: expect.any(Number),
          exp: expect.any(Number),
        }),
      })
    })

    it('should refresh token when access token is expired and refresh=true', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(`attempt_${SID_VALUE}`, createLoginAttempt(mockConfig))

      // Initialize session
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      // Set expired token in cache
      const expiredTokenResponse = {
        ...mockCachedTokenResponse,
        accessTokenExp: Date.now() - 1000, // Expired token
      }
      mockCacheStore.set(`current_${SID_VALUE}`, expiredTokenResponse)

      // Act
      const res = await server
        .get('/user')
        .query({ refresh: 'true' })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(mockTokenRefreshService.refreshToken).toHaveBeenCalledWith({
        sid: SID_VALUE,
        encryptedRefreshToken: expiredTokenResponse.encryptedRefreshToken,
      })
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({
        scopes: mockCachedTokenResponse.scopes,
        profile: mockCachedTokenResponse.userProfile,
      })
    })

    it('should not refresh token when access token is expired but refresh=false', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(`attempt_${SID_VALUE}`, createLoginAttempt(mockConfig))

      // Initialize session
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      // Set expired token in cache
      const expiredTokenResponse = {
        ...mockCachedTokenResponse,
        accessTokenExp: Date.now() - 1000, // Expired token
      }
      mockCacheStore.set(`current_${SID_VALUE}`, expiredTokenResponse)

      // Act
      const res = await server
        .get('/user')
        .query({ refresh: 'false' })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({
        scopes: expiredTokenResponse.scopes,
        profile: expiredTokenResponse.userProfile,
      })
    })
  })
})
