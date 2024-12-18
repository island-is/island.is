import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as crypto from 'crypto'
import { BffConfig } from '../bff.config'

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc'
  private readonly key: Buffer

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,
  ) {
    // Decode from base64 to binary
    this.key = Buffer.from(this.config.tokenSecretBase64, 'base64')

    // Ensure the key is exactly 32 bytes (256 bits) long
    if (this.key.length !== 32) {
      throw new Error(
        '"tokenSecretBase64" secret must be exactly 32 bytes (256 bits) long.',
      )
    }
  }

  /**
   * Encrypts a given text using the AES-256-CBC encryption algorithm.
   *
   * @param text The plain text to encrypt.
   * @param skipAlgorithmPrefix Whether to skip the algorithm prefix in the encrypted text. Default is false.
   * @returns IV encrypted text for decryption
   *
   * @example
   * const encrypted = cryptoService.encrypt('Hello, World!')
   * Output: 'aes-256-cbc:Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA='
   *
   * @example
   * const encrypted = cryptoService.encrypt('Hello, World!', true)
   * Output: 'Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA='
   */
  encrypt(text: string, skipAlgorithmPrefix = false): string {
    try {
      // Generate a random 16-byte initialization vector (IV) for the encryption
      // IV is a unique value used with the key to make each encryption unique, even with the same plaintext and key.
      const iv = crypto.randomBytes(16)

      // Create a Cipher object using the algorithm, encryption key, and initialization vector (IV)
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)

      // Encrypt the text in 'utf8' format and encode the result as base64
      let encrypted = cipher.update(text, 'utf8', 'base64')

      // Finalize the encryption, appending any remaining data
      encrypted += cipher.final('base64')

      const encryptedText = `${iv.toString('base64')}:${encrypted}`

      if (skipAlgorithmPrefix) {
        return encryptedText
      }

      // Return the algorithm, IV, and the encrypted text, separated by colons
      // The IV is used in decryption.
      return `${this.algorithm}:${encryptedText}`
    } catch (error) {
      this.logger.error('Error encrypting text:', { message: error.message })

      throw new Error('Failed to encrypt the text.')
    }
  }

  /**
   * Decrypts a given text using the AES-256-CBC decryption algorithm.
   *
   * @param encryptedText The IV encrypted text to decrypt.
   * @param skipAlgorithmPrefix Whether to skip the algorithm prefix in the encrypted text. Default is false.
   * @returns The original plain text.
   *
   * @example
   * const decrypted = cryptoService.decrypt('aes-256-cbc:Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA=')
   * Output: 'Hello, World!'
   *
   * @example
   * const decrypted = cryptoService.decrypt('Ghs8TV5veHqJkGthWklAAw==:YWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTA=', true)
   * Output: 'Hello, World!'
   */
  decrypt(encryptedText: string, skipAlgorithmPrefix = false): string {
    try {
      // Split the encrypted text into its components based on ':' delimiter
      // Format is either:
      // - With prefix: 'aes-256-cbc:iv:encryptedData'
      // - Without prefix: 'iv:encryptedData'
      const parts = encryptedText.split(':')

      // Extract IV and encrypted data based on whether we expect algorithm prefix
      // skipAlgorithmPrefix is true:
      //    parts = ['iv', 'encryptedData']
      //    [ivBase64, encrypted] = parts
      // skipAlgorithmPrefix is false:
      //    parts = ['aes-256-cbc', 'iv', 'encryptedData']
      //    [ivBase64, encrypted] = parts.slice(1)
      //
      //    Note! slice(1) removes algorithm prefix, returning ['iv', 'encryptedData'], since we already know the algorithm
      const [ivBase64, encrypted] = skipAlgorithmPrefix ? parts : parts.slice(1)

      // If encryptedText is malformed, this could lead to runtime errors or security vulnerabilities.
      // This check ensures all parts are present before proceeding.
      if (!ivBase64 || !encrypted) {
        throw new Error('Invalid encrypted text format.')
      }

      // Convert the base64-encoded IV back into a Buffer
      const iv = Buffer.from(ivBase64, 'base64')

      // Create a Decipher object using the same algorithm, key, and IV
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)

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
