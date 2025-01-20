import { ConfigType } from '@island.is/nest/config'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpStatus, INestApplication } from '@nestjs/common'
import type { Request, Response } from 'express'
import request from 'supertest'

import { setupTestServer } from '../../../../test/setupTestServer'
import {
  SESSION_COOKIE_NAME,
  SID_VALUE,
  getLoginSearchParmsFn,
  mockedTokensResponse as tokensResponse,
} from '../../../../test/sharedConstants'
import { BffConfig } from '../../bff.config'
import { SessionCookieService } from '../../services/sessionCookie.service'
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
  originUrl: `${mockConfig.clientBaseUrl}${mockConfig.clientBasePath}`,
  codeVerifier: 'test_code_verifier',
  targetLinkUri: undefined,
})

describe('UserController', () => {
  let app: INestApplication
  let server: request.SuperTest<request.Test>
  let mockConfig: ConfigType<typeof BffConfig>
  let sessionCookieService: SessionCookieService
  let hashedSid: string

  // Mock Response object
  const mockResponse: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  }

  // Mock Request object
  const mockRequest: Partial<Request> = {
    cookies: {},
  }

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

    sessionCookieService = app.get<SessionCookieService>(SessionCookieService)
    mockConfig = app.get<ConfigType<typeof BffConfig>>(BffConfig.KEY)

    // Set the hashed SID
    sessionCookieService.set({
      res: mockResponse as Response,
      value: SID_VALUE,
    })

    // Capture the hashed value from the mock cookie call
    hashedSid = (mockResponse.cookie as jest.Mock).mock.calls[0][1]

    // Set up the mock request cookies for subsequent get() calls
    mockRequest.cookies = {
      [SESSION_COOKIE_NAME]: hashedSid,
    }

    server = request(app.getHttpServer())
  })

  afterEach(() => {
    mockCacheStore.clear()
    jest.clearAllMocks()
    // Reset mocks
    mockRequest.cookies = {}
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
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should return user data when valid session exists', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(
        `attempt::${mockConfig.name}::${SID_VALUE}`,
        createLoginAttempt(mockConfig),
      )

      // Initialize session with login
      await server.get('/login')
      const callbackRes = await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      expect(callbackRes.status).toBe(HttpStatus.FOUND)

      // Act - Get user data
      const res = await server
        .get('/user')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

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
      mockCacheStore.set(
        `attempt::${mockConfig.name}::${SID_VALUE}`,
        createLoginAttempt(mockConfig),
      )

      // Initialize session
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      // Set expired token in cache
      const expiredTokenResponse = {
        ...mockCachedTokenResponse,
        accessTokenExp: Date.now() - 1000, // Expired token
      }
      mockCacheStore.set(
        `current::${mockConfig.name}::${hashedSid}`,
        expiredTokenResponse,
      )

      // Act
      const res = await server
        .get('/user')
        .query({ refresh: 'true' })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockTokenRefreshService.refreshToken).toHaveBeenCalledWith({
        cacheKey: hashedSid,
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
      mockCacheStore.set(
        `attempt::${mockConfig.name}::${SID_VALUE}`,
        createLoginAttempt(mockConfig),
      )

      // Initialize session
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      // Set expired token in cache
      const expiredTokenResponse = {
        ...mockCachedTokenResponse,
        accessTokenExp: Date.now() - 1000, // Expired token
      }
      mockCacheStore.set(
        `current::${mockConfig.name}::${hashedSid}`,
        expiredTokenResponse,
      )

      // Act
      const res = await server
        .get('/user')
        .query({ refresh: 'false' })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({
        scopes: expiredTokenResponse.scopes,
        profile: expiredTokenResponse.userProfile,
      })
    })

    it('should not refresh token when token exists but is not expired', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(
        `attempt::${mockConfig.name}::${SID_VALUE}`,
        createLoginAttempt(mockConfig),
      )

      // Initialize session
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      // Set valid (not expired) token in cache
      const validTokenResponse = {
        ...mockCachedTokenResponse,
        accessTokenExp: Date.now() + 1000, // Future expiration
      }
      mockCacheStore.set(
        `current::${mockConfig.name}::${hashedSid}`,
        validTokenResponse,
      )

      // Act
      const res = await server
        .get('/user')
        .query({ refresh: 'true' })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({
        scopes: validTokenResponse.scopes,
        profile: validTokenResponse.userProfile,
      })
    })

    it('should refresh token only when all conditions are met (token exists, is expired, and refresh=true)', async () => {
      // Arrange - Set up login attempt in cache
      mockCacheStore.set(
        `attempt::${mockConfig.name}::${SID_VALUE}`,
        createLoginAttempt(mockConfig),
      )

      const testCases = [
        {
          exists: true,
          expired: true,
          refresh: true,
          shouldCallRefresh: true,
        },
        {
          exists: true,
          expired: true,
          refresh: false,
          shouldCallRefresh: false,
        },
        {
          exists: true,
          expired: false,
          refresh: true,
          shouldCallRefresh: false,
        },
        {
          exists: false,
          expired: true,
          refresh: true,
          shouldCallRefresh: false,
        },
      ]

      for (const testCase of testCases) {
        // Reset mocks
        jest.clearAllMocks()
        mockCacheStore.clear()

        if (testCase.exists) {
          const tokenResponse = {
            ...mockCachedTokenResponse,
            accessTokenExp: testCase.expired
              ? Date.now() - 1000 // Expired
              : Date.now() + 1000, // Not expired
          }
          mockCacheStore.set(
            `current::${mockConfig.name}::${hashedSid}`,
            tokenResponse,
          )
        }

        // Act
        const res = await server
          .get('/user')
          .query({ refresh: testCase.refresh.toString() })
          .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

        // Assert
        if (testCase.shouldCallRefresh) {
          expect(mockTokenRefreshService.refreshToken).toHaveBeenCalled()
        } else {
          expect(mockTokenRefreshService.refreshToken).not.toHaveBeenCalled()
        }

        if (testCase.exists) {
          expect(res.status).toEqual(HttpStatus.OK)
        } else {
          expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
        }
      }
    })
  })
})
