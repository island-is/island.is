import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import type { Request, Response } from 'express'
import { SESSION_COOKIE_NAME } from '../constants/cookies'
import { getCookieOptions } from '../utils/get-cookie-options'
import { CryptoKeyService } from './cryptoKey.service'

@Injectable()
export class SessionCookieService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly cryptoKeyService: CryptoKeyService,
  ) {}

  /**
   * Gets the hashed session cookie value.
   *
   * Note: With hashing, we cannot recover the original value.
   * You'll need to compare hashed values to verify matches.
   */
  get(req: Request): string | undefined {
    return req.cookies[SESSION_COOKIE_NAME] ?? undefined
  }

  /**
   * Sets an encrypted session cookie with the given value
   */
  set({ res, value }: { res: Response; value: string }): void {
    try {
      const hashedValue = this.hash(value)

      res.cookie(SESSION_COOKIE_NAME, hashedValue, getCookieOptions())
    } catch (error) {
      this.logger.error('Error hashing session cookie: ', {
        message: error.message,
      })

      throw error
    }
  }

  /**
   * Verifies if a given value matches the hashed cookie
   */
  verify(req: Request, value: string): boolean {
    const hashedCookie = this.get(req)

    if (!hashedCookie) {
      return false
    }

    const hashedValue = this.hash(value)

    return hashedCookie === hashedValue
  }

  /**
   * Clears the session cookie
   */
  clear(res: Response): void {
    res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions())
  }

  /**
   * Helper method to create consistent hashes using HMAC
   */
  hash(value: string): string {
    return crypto
      .createHmac('sha256', this.cryptoKeyService.cryptoKey)
      .update(value)
      .digest('hex')
  }
}
