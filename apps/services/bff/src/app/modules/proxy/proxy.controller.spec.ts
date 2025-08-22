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
import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { IdsService } from '../ids/ids.service'
import { TokenResponse } from '../ids/ids.types'
import { ProxyService } from './proxy.service'
import { ExecuteStreamRequestArgs } from './proxy.types'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fake_uuid'),
}))

const allowedExternalApiUrl = JSON.parse(
  process.env.BFF_ALLOWED_EXTERNAL_API_URLS as unknown as string,
)[0]

const mockCacheStore = new Map()

const mockCacheManagerValue = {
  set: jest.fn((key, value) => mockCacheStore.set(key, value)),
  get: jest.fn((key) => mockCacheStore.get(key)),
  del: jest.fn((key) => mockCacheStore.delete(key)),
}

const EXPIRED_TOKEN_RESPONSE: TokenResponse = {
  ...tokensResponse,
  expires_in: 0,
}

const mockIdsService = {
  refreshToken: jest.fn().mockResolvedValue(tokensResponse),
  getTokens: jest.fn().mockResolvedValue(tokensResponse),
  revokeToken: jest.fn().mockResolvedValue(undefined),
  getLoginSearchParams: jest.fn().mockImplementation(getLoginSearchParmsFn),
}

const createTestProxyService = (
  cb: (args: ExecuteStreamRequestArgs) => void,
) => {
  return class TestProxyService extends ProxyService {
    async executeStreamRequest(args: ExecuteStreamRequestArgs): Promise<void> {
      cb(args)
    }
  }
}

describe('ProxyController', () => {
  let app: INestApplication
  let server: request.SuperTest<request.Test>
  let capturedArgs: ExecuteStreamRequestArgs
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
          .overrideProvider(IdsService)
          .useValue(mockIdsService)
          .overrideProvider(ProxyService)
          .useClass(
            createTestProxyService((args) => {
              capturedArgs = args
              args.res.status(HttpStatus.OK).json({ message: 'success' })
            }),
          ),
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
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('GET /api', () => {
    it('should throw 400 bad request when url param is not provided', async () => {
      // Act
      const res = await server.get('/api')

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('should throw 400 bad request when url param is invalid', async () => {
      // Act
      const res = await server.get('/api').query({ url: 'http://example.com' })

      // Assert
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })

    it('should throw unauthorized exception when sid cookie is not provided', async () => {
      // Act
      const res = await server.get('/api').query({ url: allowedExternalApiUrl })

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should throw unauthorized exception when cache key is not found', async () => {
      // Act
      const res = await server
        .get('/api')
        .query({ url: allowedExternalApiUrl })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should successfully proxy api request', async () => {
      // Act
      await server.get('/login')

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .get('/api')
        .query({ url: allowedExternalApiUrl })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })
  })

  describe('GET /api/graphql', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockIdsService.getTokens.mockResolvedValue(tokensResponse)
    })

    it('should throw 401 unauthorized when not logged in', async () => {
      // Act
      const res = await server.post('/api/graphql')

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should successfully proxy graphql request', async () => {
      // Act
      await server.get('/login')

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })

    it('should append query string when proxing requests', async () => {
      // Act
      await server.get('/login')

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql?op=test')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(capturedArgs.targetUrl).toEqual(
        `${mockConfig.graphqlApiEndpoint}?op=test`,
      )
    })

    it('should correctly identify that the token has expired', () => {
      const isExpired = hasTimestampExpiredInMS(
        EXPIRED_TOKEN_RESPONSE.expires_in,
      )

      expect(isExpired).toBe(true)
    })

    it('should call refreshToken and cache token response when access_token is expired', async () => {
      // Arrange
      mockIdsService.getTokens.mockResolvedValue(EXPIRED_TOKEN_RESPONSE)

      // Act
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockIdsService.refreshToken).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
    })

    it('should handle polling timeout and retry', async () => {
      // Arrange
      const encryptedTokens = {
        encryptedAccessToken: 'encrypted_access_token',
        encryptedRefreshToken: 'encrypted_refresh_token',
        accessTokenExp: Date.now(),
      }

      mockIdsService.getTokens.mockResolvedValue(EXPIRED_TOKEN_RESPONSE)
      mockIdsService.refreshToken.mockResolvedValue(tokensResponse)

      // Set up initial cache state
      mockCacheStore.set(`current_${SID_VALUE}`, {
        ...EXPIRED_TOKEN_RESPONSE,
        ...encryptedTokens,
      })
      mockCacheStore.set(`refresh_token_in_progress:${SID_VALUE}`, true)

      // Act
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockIdsService.refreshToken).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })

    it('should handle polling and not call ids refresh token', async () => {
      // Arrange
      const encryptedTokens = {
        encryptedAccessToken: 'encrypted_access_token',
        encryptedRefreshToken: 'encrypted_refresh_token',
        accessTokenExp: Date.now() + 3600000, // Valid for 1 hour
      }

      mockIdsService.getTokens.mockResolvedValue({
        ...tokensResponse,
        ...encryptedTokens,
      })

      // Set up initial cache state
      mockCacheStore.set(`current_${SID_VALUE}`, {
        ...tokensResponse,
        ...encryptedTokens,
      })
      mockCacheStore.set(`refresh_token_in_progress:${SID_VALUE}`, true)

      // Simulate another service completing the refresh
      setTimeout(() => {
        mockCacheStore.delete(`refresh_token_in_progress:${SID_VALUE}`)
        mockCacheStore.set(`current_${SID_VALUE}`, {
          ...tokensResponse,
          ...encryptedTokens,
        })
      }, 100)

      // Act
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${hashedSid}`])

      // Assert
      expect(mockIdsService.refreshToken).not.toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })
  })
})
