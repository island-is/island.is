import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'
import { Cache as CacheManager } from 'cache-manager'
import { BffConfig } from '../../bff.config'
import { CacheService } from './cache.service'

const mockConfig = {
  name: 'test-bff',
}

class TestCacheService extends CacheService {
  public testKeyWithoutSid(key: string): string {
    return this['keyWithoutSid'](key)
  }
}

describe('CacheService', () => {
  let service: TestCacheService
  let mockCacheManager: jest.Mocked<CacheManager>

  beforeEach(async () => {
    mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<CacheManager>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CacheService,
          useClass: TestCacheService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: BffConfig.KEY,
          useValue: mockConfig,
        },
      ],
    }).compile()

    service = module.get<TestCacheService>(CacheService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('keyWithoutSid', () => {
    it('should keep only first two parts of key regardless of total parts', () => {
      // Arrange
      const key = 'attempt::test-bff::1234::extra::more'

      // Act
      const result = service.testKeyWithoutSid(key)

      // Assert
      expect(result).toBe('attempt::test-bff')
    })

    it('should return original key if it has less than two parts', () => {
      // Arrange
      const key = 'attempt'

      // Act
      const result = service.testKeyWithoutSid(key)

      // Assert
      expect(result).toBe('attempt')
    })

    it('should return original key if it has exactly two parts', () => {
      // Arrange
      const key = 'attempt::test-bff'

      // Act
      const result = service.testKeyWithoutSid(key)

      // Assert
      expect(result).toBe('attempt::test-bff')
    })
  })

  describe('createKeyError', () => {
    it('should create error message with sanitized key', () => {
      // Arrange
      const key = 'attempt::test-bff::1234'

      // Act
      const result = service.createKeyError(key)

      // Assert
      expect(result).toBe('Cache key "attempt::test-bff" not found.')
    })
  })

  describe('createSessionKeyType', () => {
    it('should create attempt key', () => {
      // Act
      const result = service.createSessionKeyType('attempt', '1234')

      // Assert
      expect(result).toBe('attempt::test-bff::1234')
    })

    it('should create current key', () => {
      // Act
      const result = service.createSessionKeyType('current', '1234')

      // Assert
      expect(result).toBe('current::test-bff::1234')
    })
  })

  describe('save', () => {
    it('should save value with ttl', async () => {
      // Arrange
      const key = 'test-key'
      const value = { data: 'test' }
      const ttl = 1000

      // Act
      await service.save({ key, value, ttl })

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, ttl)
    })

    it('should save value without ttl', async () => {
      // Arrange
      const key = 'test-key'
      const value = { data: 'test' }

      // Act
      await service.save({ key, value })

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, undefined)
    })
  })

  describe('get', () => {
    it('should return cached value when exists', async () => {
      // Arrange
      const key = 'test-key'
      const value = { data: 'test' }
      mockCacheManager.get.mockResolvedValue(value)

      // Act
      const result = await service.get<{ data: string }>(key)

      // Assert
      expect(result).toEqual(value)
      expect(mockCacheManager.get).toHaveBeenCalledWith(key)
    })

    it('should throw error when value does not exist and throwError is true', async () => {
      // Arrange
      const key = 'test-key'
      mockCacheManager.get.mockResolvedValue(null)

      // Act & Assert
      await expect(service.get(key)).rejects.toThrow(
        'Cache key "test-key" not found.',
      )
    })

    it('should return null when value does not exist and throwError is false', async () => {
      // Arrange
      const key = 'test-key'
      mockCacheManager.get.mockResolvedValue(null)

      // Act
      const result = await service.get(key, false)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete cache entry', async () => {
      // Arrange
      const key = 'test-key'
      mockCacheManager.del.mockResolvedValue(undefined)

      // Act
      await service.delete(key)

      // Assert
      expect(mockCacheManager.del).toHaveBeenCalledWith(key)
    })

    it('should throw error with sanitized key when deletion fails', async () => {
      // Arrange
      const key = 'attempt::test-bff::1234'
      mockCacheManager.del.mockRejectedValue(new Error('Deletion failed'))

      // Act & Assert
      await expect(service.delete(key)).rejects.toThrow(
        'Failed to delete key "attempt::test-bff" from cache.',
      )
    })
  })
})
