import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import type { Request, Response } from 'express'
import { environment } from '../../environment'
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

  public getAllSidCookies(req: Request): string[] {
    const cookieHeader = req.headers.cookie

    if (!cookieHeader) {
      return []
    }

    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .filter((cookie) => cookie.startsWith(`${SESSION_COOKIE_NAME}=`))
      .map((cookie) => cookie.substring(SESSION_COOKIE_NAME.length + 1))
  }

  /**
   * Gets the hashed session cookie value.
   * In some rare cases multiple session cookies are found, if that happens
   * we log a warning and clear all but the most recent sid cookie.
   *
   * Note: With hashing, we cannot recover the original value.
   * You'll need to compare hashed values to verify matches.
   */
  get({ req, res }: { req: Request; res?: Response }): string | undefined {
    const allSids = this.getAllSidCookies(req)

    if (allSids.length > 1) {
      this.logger.info('Multiple session cookies found:', {
        count: allSids.length,
        sids: allSids.map(
          (sid) =>
            // Only show the first and last 6 characters
            `${sid.substring(0, 6)}...${sid.substring(
              sid.length - 6,
              sid.length,
            )}`,
        ),
        path: environment.globalPrefix,
      })

      // Get the most recent sid cookie (last in array)
      const mostRecentSid = allSids[allSids.length - 1]
      const olderSids = allSids.slice(0, -1)

      if (res) {
        // Clear each older cookie individually because
        // res.clearCookie() will only remove one cookie at a time.
        // When Express sends the Set-Cookie header with an expired date,
        // it can only clear one cookie at a time because each Set-Cookie header
        // can only target one specific cookie (combination of name and path).
        olderSids.forEach(() => {
          res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions())
        })
      }

      return mostRecentSid
    }

    return req.cookies[SESSION_COOKIE_NAME]
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
    const hashedCookie = this.get({ req })

    if (!hashedCookie) {
      return false
    }

    const hashedValue = this.hash(value)

    return hashedCookie === hashedValue
  }

  /**
   * Clears all session cookies
   */
  clear({ req, res }: { req: Request; res: Response }): void {
    const allSids = this.getAllSidCookies(req)

    allSids.forEach(() => {
      res.clearCookie(SESSION_COOKIE_NAME, getCookieOptions())
    })
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
