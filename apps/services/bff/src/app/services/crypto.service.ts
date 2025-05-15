import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { CryptoKeyService } from './cryptoKey.service'

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc'

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly cryptoKeyService: CryptoKeyService,
  ) {}

  /**
   * Encrypts a given text using the AES-256-CBC encryption algorithm.
   *
   * @param text The plain text to encrypt.
   * @returns IV encrypted text for decryption
   *
   * @example
   * const encrypted = cryptoService.encrypt('Hello, World!')
   * Output: 'aes-256-cbc:Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA='
   */
  encrypt(text: string): string {
    try {
      // Generate a random 16-byte initialization vector (IV) for the encryption
      // IV is a unique value used with the key to make each encryption unique, even with the same plaintext and key.
      const iv = crypto.randomBytes(16)

      // Create a Cipher object using the algorithm, encryption key, and initialization vector (IV)
      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.cryptoKeyService.cryptoKey,
        iv,
      )

      // Encrypt the text in 'utf8' format and encode the result as base64
      let encrypted = cipher.update(text, 'utf8', 'base64')

      // Finalize the encryption, appending any remaining data
      encrypted += cipher.final('base64')

      // Return the algorithm, IV, and the encrypted text, separated by colons
      // The IV is used in decryption.
      return `${this.algorithm}:${iv.toString('base64')}:${encrypted}`
    } catch (error) {
      this.logger.error('Error encrypting text:', { message: error.message })

      throw new Error('Failed to encrypt the text.')
    }
  }

  /**
   * Decrypts a given text using the AES-256-CBC decryption algorithm.
   *
   * @param encryptedText The IV encrypted text to decrypt.
   * @returns The original plain text.
   *
   * @example
   * const decrypted = cryptoService.decrypt('aes-256-cbc:Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA=')
   * Output: 'Hello, World!'
   */
  decrypt(encryptedText: string): string {
    try {
      // Split the input into the algorithm, IV (initialization vector), and the encrypted text
      const [_algorithm, ivBase64, encrypted] = encryptedText.split(':')

      // If encryptedText is malformed, this could lead to runtime errors or security vulnerabilities.
      // This check ensures all parts are present before proceeding.
      if (!ivBase64 || !encrypted) {
        throw new Error('Invalid encrypted text format.')
      }

      // Convert the base64-encoded IV back into a Buffer
      const iv = Buffer.from(ivBase64, 'base64')

      // Create a Decipher object using the same algorithm, key, and IV
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.cryptoKeyService.cryptoKey,
        iv,
      )

      // Decrypt the encrypted text from base64 to utf8 format
      let decrypted = decipher.update(encrypted, 'base64', 'utf8')

      // Finalize the decryption, appending any remaining data
      decrypted += decipher.final('utf8')

      // Return the decrypted plaintext
      return decrypted
    } catch (error) {
      this.logger.error('Error decrypting text:', { message: error.message })

      throw new Error('Failed to decrypt the text.')
    }
  }
}
