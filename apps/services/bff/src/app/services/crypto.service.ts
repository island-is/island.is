import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
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
   * @returns IV encrypted text for decryption
   */
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
      let encrypted = cipher.update(text, 'utf8', 'base64')
      encrypted += cipher.final('base64')

      return `${iv.toString('base64')}:${encrypted}`
    } catch (error) {
      this.logger.error('Error encrypting text:', error)

      throw new InternalServerErrorException()
    }
  }

  /**
   * Decrypts a given text using the AES-256-CBC decryption algorithm.
   * @returns The original plain text.
   */
  decrypt(encryptedText: string): string {
    try {
      const [ivBase64, encrypted] = encryptedText.split(':')
      const iv = Buffer.from(ivBase64, 'base64')
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
      let decrypted = decipher.update(encrypted, 'base64', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      this.logger.error('Error decrypting text:', error)

      throw new InternalServerErrorException()
    }
  }
}
