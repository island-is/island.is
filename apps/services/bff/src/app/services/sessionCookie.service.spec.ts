import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test, TestingModule } from '@nestjs/testing'
import type { Request, Response } from 'express'
import { tokenSecretBase64 } from '../../../test/sharedConstants'
import { BffConfig } from '../bff.config'
import { SESSION_COOKIE_NAME } from '../constants/cookies'
import { getCookieOptions } from '../utils/get-cookie-options'
import { CryptoKeyService } from './cryptoKey.service'
import { SessionCookieService } from './sessionCookie.service'

const mockLogger = {
  error: jest.fn(),
} as unknown as Logger

const validConfig = {
  tokenSecretBase64,
}

describe('SessionCookieService', () => {
  let service: SessionCookieService
  let mockResponse: Partial<Response>
  let mockRequest: Partial<Request>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionCookieService,
        CryptoKeyService,
        { provide: LOGGER_PROVIDER, useValue: mockLogger },
        { provide: BffConfig.KEY, useValue: validConfig },
      ],
    }).compile()

    service = module.get<SessionCookieService>(SessionCookieService)

    // Reset mocks
    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    }

    mockRequest = {
      cookies: {},
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('should return undefined when cookie is not present', () => {
      const result = service.get(mockRequest as Request)
      expect(result).toBeUndefined()
    })

    it('should return cookie value when present', () => {
      const cookieValue = 'test-cookie-value'
      mockRequest.cookies = { [SESSION_COOKIE_NAME]: cookieValue }

      const result = service.get(mockRequest as Request)
      expect(result).toBe(cookieValue)
    })
  })

  describe('set', () => {
    it('should set cookie with hashed value', () => {
      const value = 'test-value'
      const hashedValue = service.hash(value)

      service.set({ res: mockResponse as Response, value })

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        hashedValue,
        getCookieOptions(),
      )
    })

    it('should throw error if hashing fails', () => {
      // Mock hash method to throw error
      jest.spyOn(service, 'hash').mockImplementation(() => {
        throw new Error('Hashing failed')
      })

      expect(() =>
        service.set({ res: mockResponse as Response, value: 'test-value' }),
      ).toThrow('Hashing failed')

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error hashing session cookie: ',
        { message: 'Hashing failed' },
      )
    })
  })

  describe('verify', () => {
    it('should return false when cookie is not present', () => {
      const result = service.verify(mockRequest as Request, 'test-value')
      expect(result).toBe(false)
    })

    it('should return true when value matches hashed cookie', () => {
      const value = 'test-value'
      const hashedValue = service.hash(value)
      mockRequest.cookies = { [SESSION_COOKIE_NAME]: hashedValue }

      const result = service.verify(mockRequest as Request, value)
      expect(result).toBe(true)
    })

    it('should return false when value does not match hashed cookie', () => {
      const hashedValue = service.hash('original-value')
      mockRequest.cookies = { [SESSION_COOKIE_NAME]: hashedValue }

      const result = service.verify(mockRequest as Request, 'different-value')
      expect(result).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear the session cookie', () => {
      service.clear(mockResponse as Response)

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        SESSION_COOKIE_NAME,
        expect.any(Object),
      )
    })
  })

  describe('hash', () => {
    it('should create consistent hashes for the same value', () => {
      const value = 'test-value'
      const hash1 = service.hash(value)
      const hash2 = service.hash(value)

      expect(hash1).toBe(hash2)
    })

    it('should create different hashes for different values', () => {
      const hash1 = service.hash('value1')
      const hash2 = service.hash('value2')

      expect(hash1).not.toBe(hash2)
    })

    it('should return a hex string', () => {
      const value = 'test-value'
      const hash = service.hash(value)

      // Hex string should only contain hexadecimal characters
      expect(hash).toMatch(/^[0-9a-f]+$/)
    })
  })
})
