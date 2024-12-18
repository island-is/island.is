import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test, TestingModule } from '@nestjs/testing'
import crypto from 'crypto'
import { BffConfig } from '../bff.config'
import { CryptoService } from './crypto.service'

const DECRYPTED_TEXT = 'Hello, World!'

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Buffer) => crypto.randomBytes(arr.length),
  },
})

const invalidConfig = {
  tokenSecretBase64: 'shortkey',
}

const validConfig = {
  // A valid 32-byte base64 key
  tokenSecretBase64: 'ABHlmq6Ic6Ihip4OnTa1MeUXtHFex8IT/mFZrjhsme0=',
}

const mockLogger = {
  error: jest.fn(),
} as unknown as Logger

const createModule = async (config = validConfig): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      CryptoService,
      { provide: LOGGER_PROVIDER, useValue: mockLogger },
      { provide: BffConfig.KEY, useValue: config },
    ],
  }).compile()
}

describe('CryptoService Constructor', () => {
  it('should throw an error if "tokenSecretBase64" is not 32 bytes long', async () => {
    try {
      const module = await createModule(invalidConfig)
      module.get<CryptoService>(CryptoService)
      // Fail the test if no error is thrown
      fail('Expected constructor to throw an error, but it did not.')
    } catch (error) {
      expect(error.message).toBe(
        '"tokenSecretBase64" secret must be exactly 32 bytes (256 bits) long.',
      )
    }
  })

  it('should not throw an error if "tokenSecretBase64" is 32 bytes long', async () => {
    try {
      const module = await createModule()
      module.get<CryptoService>(CryptoService)
      // No error means the test passes
    } catch (error) {
      fail(`Expected no error, but received: ${error.message}`)
    }
  })
})

describe('CryptoService', () => {
  let service: CryptoService

  beforeEach(async () => {
    const module = await createModule()
    service = module.get<CryptoService>(CryptoService)
  })

  describe('encrypt', () => {
    it('should encrypt and return a string containing IV and encrypted text', () => {
      const encryptedText = service.encrypt(DECRYPTED_TEXT)
      const [algorithm, ivBase64, encrypted] = encryptedText.split(':')

      expect(algorithm).toEqual('aes-256-cbc')
      // IV in base64 (16 bytes) should be 24 characters long
      expect(ivBase64).toHaveLength(24)
      expect(encrypted.length).toBeGreaterThan(0)
    })
  })

  describe('decrypt', () => {
    it('should decrypt an encrypted string and return the original text', () => {
      const encryptedText = service.encrypt(DECRYPTED_TEXT)
      const decryptedText = service.decrypt(encryptedText)

      expect(decryptedText).toBe(DECRYPTED_TEXT)
    })
  })

  describe('skipAlgorithmPrefix', () => {
    const testText = 'Hello, World!'

    it('should encrypt and decrypt with algorithm prefix (default behavior)', () => {
      // Act - Encrypt the test text
      const encrypted = service.encrypt(testText)

      // Assert - Verify the encrypted format includes algorithm prefix
      expect(encrypted.startsWith('aes-256-cbc:')).toBe(true)
      expect(encrypted.split(':').length).toBe(3)

      // Act - Decrypt the encrypted text
      const decrypted = service.decrypt(encrypted)

      // Assert - Verify the decrypted text matches original
      expect(decrypted).toBe(testText)
    })

    it('should encrypt and decrypt without algorithm prefix', () => {
      // Act - Encrypt the test text without algorithm prefix
      const encrypted = service.encrypt(testText, true)

      // Assert - Verify the encrypted format excludes algorithm prefix
      expect(encrypted.startsWith('aes-256-cbc:')).toBe(false)
      expect(encrypted.split(':').length).toBe(2)

      // Act - Decrypt the encrypted text without algorithm prefix
      const decrypted = service.decrypt(encrypted, true)

      // Assert - Verify the decrypted text matches original
      expect(decrypted).toBe(testText)
    })

    it('should fail to decrypt when skipAlgorithmPrefix flag doesnt match the format', () => {
      // Arrange - Create encrypted texts in both formats
      const encryptedWithPrefix = service.encrypt(testText)
      const encryptedWithoutPrefix = service.encrypt(testText, true)

      // Act & Assert - Try to decrypt with mismatched prefix settings
      // Should throw error when trying to decrypt with-prefix text using without-prefix mode
      expect(() => service.decrypt(encryptedWithPrefix, true)).toThrow(
        'Failed to decrypt the text.',
      )

      // Should throw error when trying to decrypt without-prefix text using with-prefix mode
      expect(() => service.decrypt(encryptedWithoutPrefix)).toThrow(
        'Failed to decrypt the text.',
      )
    })
  })
})
