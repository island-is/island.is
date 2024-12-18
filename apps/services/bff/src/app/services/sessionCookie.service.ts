import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import type { Request, Response } from 'express'
import { SESSION_COOKIE_NAME } from '../constants/cookies'
import { getCookieOptions } from '../utils/get-cookie-options'
import { CryptoService } from './crypto.service'

@Injectable()
export class SessionCookieService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Sets an encrypted session cookie with the given value
   */
  set({ res, value }: { res: Response; value: string }): void {
    try {
      const encryptedValue = this.cryptoService.encrypt(value, true)

      res.cookie(SESSION_COOKIE_NAME, encryptedValue, getCookieOptions())
    } catch (error) {
      this.logger.error('Error setting encrypted session cookie: ', {
        message: error.message,
      })

      throw error
    }
  }

  /**
   * Gets and decrypts the session cookie value.
   *
   * Note! We deliperately return undefined if the cookie is not found or if decryption fails,
   * to mimic the behavior of not found in `req.cookies` object.
   */
  get(req: Request): string | undefined {
    const encryptedValue = req.cookies[SESSION_COOKIE_NAME]

    if (!encryptedValue) {
      return
    }

    try {
      return this.cryptoService.decrypt(encryptedValue, true)
    } catch (error) {
      this.logger.error('Error decrypting session cookie:', {
        message: error.message,
      })
    }
  }

  /**
   * Clears the session cookie
   */
  clear(res: Response): void {
    res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions())
  }
}
