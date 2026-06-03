import { Cache as CacheManager } from 'cache-manager'
import * as crypto from 'crypto'
import { v4 as uuid } from 'uuid'

import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS } from '@island.is/judicial-system/consts'

import { authModuleConfig } from './auth.config'

const ALGORITHM = 'aes-256-cbc'

@Injectable()
export class TokenStorageService {
  private readonly cryptoKey: Buffer

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    const key = Buffer.from(this.config.tokenSecretBase64, 'base64')

    if (key.length !== 32) {
      throw new Error(
        'AUTH_TOKEN_SECRET_BASE64 must decode to exactly 32 bytes (256 bits).',
      )
    }

    this.cryptoKey = key
  }

  private cacheKey(sessionId: string): string {
    return `session::judicial-system::${sessionId}`
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, this.cryptoKey, iv)
    let encrypted = cipher.update(text, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return `${ALGORITHM}:${iv.toString('base64')}:${encrypted}`
  }

  decrypt(encryptedText: string): string {
    const [, ivBase64, encrypted] = encryptedText.split(':')

    if (!ivBase64 || !encrypted) {
      throw new Error('Invalid encrypted token format.')
    }

    const iv = Buffer.from(ivBase64, 'base64')
    const decipher = crypto.createDecipheriv(ALGORITHM, this.cryptoKey, iv)
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  async storeRefreshToken(refreshToken: string): Promise<string> {
    const sessionId = uuid()
    await this.cacheManager.set(
      this.cacheKey(sessionId),
      this.encrypt(refreshToken),
      REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
    )
    return sessionId
  }

  async getRefreshToken(sessionId: string): Promise<string | null> {
    const encryptedToken = await this.cacheManager.get<string>(
      this.cacheKey(sessionId),
    )

    if (!encryptedToken) {
      this.logger.warn('Refresh token session not found in cache', {
        sessionId,
      })
      return null
    }

    return this.decrypt(encryptedToken)
  }

  async updateRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.cacheManager.set(
      this.cacheKey(sessionId),
      this.encrypt(refreshToken),
      REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS,
    )
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.cacheManager.del(this.cacheKey(sessionId))
  }
}
