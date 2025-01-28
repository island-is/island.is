import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { BffConfig } from '../bff.config'

/**
 * Service that handles the initialization and validation of the 256-bit cryptographic key
 * used for both AES-256-CBC encryption and HMAC-SHA256 hashing operations.
 *
 * The key is derived from a base64 encoded secret configured in the application settings.
 * It must be exactly 32 bytes (256 bits) when decoded.
 */
@Injectable()
export class CryptoKeyService {
  private readonly _cryptoKey: Buffer

  constructor(
    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,
  ) {
    this._cryptoKey = this.initializeCryptoKey()
  }

  /**
   * Initializes and validates the cryptographic key.
   * The key must be a base64 encoded string that decodes to exactly 32 bytes (256 bits).
   *
   * @throws Error if the decoded key is not exactly 32 bytes
   * @returns Buffer containing the 256-bit key
   */
  private initializeCryptoKey(): Buffer {
    const key = Buffer.from(this.config.tokenSecretBase64, 'base64')

    if (key.length !== 32) {
      throw new Error(
        '"tokenSecretBase64" secret must be exactly 32 bytes (256 bits) long.',
      )
    }

    return key
  }

  /**
   * Returns the 256-bit cryptographic key used for AES-256-CBC encryption
   * and HMAC-SHA256 hashing operations.
   */
  get cryptoKey(): Buffer {
    return this._cryptoKey
  }
}
