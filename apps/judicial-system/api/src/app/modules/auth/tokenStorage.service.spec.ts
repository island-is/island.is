import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS } from '@island.is/judicial-system/consts'

import { authModuleConfig } from './auth.config'
import { TokenStorageService } from './tokenStorage.service'

// 32 bytes of zeros encoded as base64 — valid dev key
const TOKEN_SECRET_BASE64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='

const mockLogger = {
  warn: jest.fn(),
  error: jest.fn(),
}

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}

const createModule = async (
  tokenSecretBase64 = TOKEN_SECRET_BASE64,
): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      TokenStorageService,
      { provide: CACHE_MANAGER, useValue: mockCacheManager },
      { provide: LOGGER_PROVIDER, useValue: mockLogger },
      {
        provide: authModuleConfig.KEY,
        useValue: {
          tokenSecretBase64,
          redis: { nodes: [], ssl: false, name: 'judicial-system' },
        },
      },
    ],
  }).compile()
}

describe('TokenStorageService constructor', () => {
  it('throws if tokenSecretBase64 does not decode to 32 bytes', async () => {
    await expect(createModule('shortkey')).rejects.toThrow(
      'AUTH_TOKEN_SECRET_BASE64 must decode to exactly 32 bytes (256 bits).',
    )
  })

  it('does not throw with a valid 32-byte key', async () => {
    await expect(createModule()).resolves.toBeDefined()
  })
})

describe('TokenStorageService', () => {
  let service: TokenStorageService

  beforeEach(async () => {
    jest.clearAllMocks()
    const module = await createModule()
    service = module.get<TokenStorageService>(TokenStorageService)
  })

  describe('decrypt(encrypt(x)) === x', () => {
    it('round-trips arbitrary strings', () => {
      const original = 'some-refresh-token-value'
      const encrypted = (service as any).encrypt(original)
      expect(service.decrypt(encrypted)).toBe(original)
    })

    it('produces different ciphertext each call (random IV)', () => {
      const a = (service as any).encrypt('token')
      const b = (service as any).encrypt('token')
      expect(a).not.toBe(b)
    })
  })

  describe('decrypt', () => {
    it('throws on malformed input', () => {
      expect(() => service.decrypt('not-valid')).toThrow(
        'Invalid encrypted token format.',
      )
    })
  })

  describe('storeRefreshToken', () => {
    it('stores an encrypted token and returns a UUID session ID', async () => {
      mockCacheManager.set.mockResolvedValue(undefined)

      const sessionId = await service.storeRefreshToken('my-refresh-token')

      expect(sessionId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        `session::judicial-system::${sessionId}`,
        expect.stringMatching(/^aes-256-cbc:/),
        REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
      )
    })
  })

  describe('getRefreshToken', () => {
    it('returns null and warns when session is not in cache', async () => {
      mockCacheManager.get.mockResolvedValue(undefined)

      const result = await service.getRefreshToken('missing-session-id')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalled()
    })

    it('decrypts and returns the refresh token when found', async () => {
      const original = 'the-real-refresh-token'
      const encrypted = (service as any).encrypt(original)
      mockCacheManager.get.mockResolvedValue(encrypted)

      const result = await service.getRefreshToken('some-session-id')

      expect(result).toBe(original)
    })
  })

  describe('updateRefreshToken', () => {
    it('writes an encrypted token to the existing session key', async () => {
      mockCacheManager.set.mockResolvedValue(undefined)

      await service.updateRefreshToken('my-session', 'new-token')

      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'session::judicial-system::my-session',
        expect.stringMatching(/^aes-256-cbc:/),
        REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
      )
    })
  })

  describe('deleteSession', () => {
    it('deletes the cache entry for the session', async () => {
      mockCacheManager.del.mockResolvedValue(undefined)

      await service.deleteSession('my-session')

      expect(mockCacheManager.del).toHaveBeenCalledWith(
        'session::judicial-system::my-session',
      )
    })
  })
})
