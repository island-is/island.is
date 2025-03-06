import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'
import { AuthService } from './auth.service'
import { CachedTokenResponse } from './auth.types'
import { TokenRefreshService } from './token-refresh.service'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('fake_uuid'),
}))

const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
}

const mockCacheStore = new Map()

const mockTokenResponse: CachedTokenResponse = {
  id_token: 'mock.id.token',
  expires_in: 3600,
  token_type: 'Bearer',
  scope: 'openid profile offline_access',
  scopes: ['openid', 'profile', 'offline_access'],
  userProfile: {
    sid: 'test-session-id',
    nationalId: '1234567890',
    name: 'Test User',
    idp: 'test-idp',
    subjectType: 'person',
    delegationType: [],
    locale: 'is',
    birthdate: '1990-01-01',
    iss: 'https://innskra.dev01.devland.is',
  },
  accessTokenExp: Date.now() + 3600000, // Current time + 1 hour in milliseconds
  encryptedAccessToken: 'encrypted.access.token',
  encryptedRefreshToken: 'encrypted.refresh.token',
}

describe('TokenRefreshService', () => {
  let service: TokenRefreshService
  let authService: AuthService
  let idsService: IdsService
  let cacheService: CacheService
  const testCacheKey = 'test-sid'
  const testRefreshToken = 'test-refresh-token'
  const refreshInProgressPrefix = 'refresh_token_in_progress'
  const refreshInProgressKey = `${refreshInProgressPrefix}:${testCacheKey}`

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenRefreshService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: AuthService,
          useValue: {
            updateTokenCache: jest.fn().mockResolvedValue(mockTokenResponse),
          },
        },
        {
          provide: IdsService,
          useValue: {
            refreshToken: jest.fn().mockResolvedValue(mockTokenResponse),
          },
        },
        {
          provide: CacheService,
          useValue: {
            save: jest.fn().mockImplementation(async ({ key, value }) => {
              mockCacheStore.set(key, value)
            }),
            get: jest
              .fn()
              .mockImplementation(async (key) => mockCacheStore.get(key)),
            delete: jest
              .fn()
              .mockImplementation(async (key) => mockCacheStore.delete(key)),
            createSessionKeyType: jest.fn(
              (type, cackeKey) => `${type}_${cackeKey}`,
            ),
          },
        },
      ],
    }).compile()

    service = module.get<TokenRefreshService>(TokenRefreshService)
    authService = module.get<AuthService>(AuthService)
    idsService = module.get<IdsService>(IdsService)
    cacheService = module.get<CacheService>(CacheService)
  })

  afterEach(() => {
    mockCacheStore.clear()
    jest.clearAllMocks()
  })

  describe('refreshToken', () => {
    it('should successfully refresh token when no refresh is in progress', async () => {
      // Act
      const result = await service.refreshToken({
        cacheKey: testCacheKey,
        encryptedRefreshToken: testRefreshToken,
      })

      // Assert
      expect(idsService.refreshToken).toHaveBeenCalledWith(testRefreshToken)
      expect(authService.updateTokenCache).toHaveBeenCalledWith(
        mockTokenResponse,
      )
      expect(result).toEqual(mockTokenResponse)
    })

    it('should wait for ongoing refresh and return cached result', async () => {
      // Arrange
      await cacheService.save({
        key: refreshInProgressKey,
        value: true,
        ttl: 3000,
      })

      // Simulate another service updating the token while we wait
      setTimeout(async () => {
        await cacheService.delete(refreshInProgressKey)
        await cacheService.save({
          key: `current_${testCacheKey}`,
          value: mockTokenResponse,
          ttl: 3600,
        })
      }, 500)

      // Act
      const result = await service.refreshToken({
        cacheKey: testCacheKey,
        encryptedRefreshToken: testRefreshToken,
      })

      // Assert
      expect(result).toEqual(mockTokenResponse)
      expect(idsService.refreshToken).not.toHaveBeenCalled()
    })

    it('should retry refresh if polling times out', async () => {
      // Arrange
      await cacheService.save({
        key: refreshInProgressKey,
        value: true,
        ttl: 3000,
      })

      // Act
      const result = await service.refreshToken({
        cacheKey: testCacheKey,
        encryptedRefreshToken: testRefreshToken,
      })

      // Assert
      expect(mockLogger.warn).toHaveBeenCalled()
      expect(idsService.refreshToken).toHaveBeenCalledWith(testRefreshToken)
      expect(result).toEqual(mockTokenResponse)
    })

    it('should handle refresh token failure', async () => {
      // Arrange
      const error = new Error('Refresh token failed')
      jest.spyOn(idsService, 'refreshToken').mockRejectedValueOnce(error)

      // Act
      const cachedTokenResponse = await service.refreshToken({
        cacheKey: testCacheKey,
        encryptedRefreshToken: testRefreshToken,
      })
      //
      expect(cachedTokenResponse).toBe(null)

      expect(mockLogger.warn).toHaveBeenCalledWith('Token refresh failed')
    })

    it('should prevent concurrent refresh token requests', async () => {
      // Arrange
      const refreshPromises = []
      const refreshCount = 5
      let firstRequestStarted = false

      // Mock cache.get to make sure first request get in progress lock and other requests waits
      jest.spyOn(cacheService, 'get').mockImplementation(async (key) => {
        if (key.includes(refreshInProgressPrefix)) {
          return firstRequestStarted
        }
        return mockTokenResponse
      })

      // Mock cache.save to track first request
      jest.spyOn(cacheService, 'save').mockImplementation(async ({ key }) => {
        if (key.includes(refreshInProgressPrefix)) {
          firstRequestStarted = true
          // Add delay after setting lock
          await delay(50)
        }
      })

      // Mock cache.delete to clear the lock
      jest.spyOn(cacheService, 'delete').mockImplementation(async (key) => {
        if (key.includes(refreshInProgressPrefix)) {
          firstRequestStarted = false
        }
      })

      // Act
      // First request
      refreshPromises.push(
        service.refreshToken({
          cacheKey: testCacheKey,
          encryptedRefreshToken: testRefreshToken,
        }),
      )

      // Wait a tick to ensure first request starts
      await delay(10)

      // Remaining requests
      for (let i = 1; i < refreshCount; i++) {
        refreshPromises.push(
          service.refreshToken({
            cacheKey: testCacheKey,
            encryptedRefreshToken: testRefreshToken,
          }),
        )
      }

      // Wait for all promises to resolve
      const results = await Promise.all(refreshPromises)

      // Assert
      expect(idsService.refreshToken).toHaveBeenCalledTimes(1)
      results.forEach((result) => {
        expect(result).toEqual(mockTokenResponse)
      })
    })
  })
})
