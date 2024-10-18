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
import { BffConfig } from '../../bff.config'
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
  refreshToken: jest.fn().mockResolvedValue({
    type: 'success',
    data: tokensResponse,
  }),
  getTokens: jest.fn().mockResolvedValue({
    type: 'success',
    data: tokensResponse,
  }),
  revokeToken: jest.fn().mockResolvedValue({
    type: 'success',
  }),
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

  beforeAll(async () => {
    const app = await setupTestServer({
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
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })

    it('should successfully proxy api request', async () => {
      // Act
      await server.get('/login')

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .get('/api')
        .query({ url: allowedExternalApiUrl })
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })
  })

  describe('GET /api/graphql', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockIdsService.getTokens.mockResolvedValue({
        type: 'success',
        data: tokensResponse,
      })
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
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(res.status).toEqual(HttpStatus.OK)
      expect(res.body).toEqual({ message: 'success' })
    })

    it('should append query string when proxing requests', async () => {
      // Act
      await server.get('/login')

      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql?op=test')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

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
      mockIdsService.getTokens.mockResolvedValue({
        type: 'success',
        data: EXPIRED_TOKEN_RESPONSE,
      })

      // Act
      await server.get('/login')
      await server
        .get('/callbacks/login')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])
        .query({ code: 'some_code', state: SID_VALUE })

      const res = await server
        .post('/api/graphql')
        .set('Cookie', [`${SESSION_COOKIE_NAME}=${SID_VALUE}`])

      // Assert
      expect(mockIdsService.refreshToken).toHaveBeenCalled()
      expect(res.status).toEqual(HttpStatus.OK)
    })
  })
})
