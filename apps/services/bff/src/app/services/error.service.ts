import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import type { Response } from 'express'
import { CacheService } from '../modules/cache/cache.service'
import { SessionCookieService } from './sessionCookie.service'

/**
 * Standard OAuth2 error codes returned by Identity Server
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
 */
export type OAuth2ErrorCode =
  | 'invalid_grant' // Refresh token expired, invalid, or revoked
  | 'invalid_client' // Client authentication failed
  | 'invalid_request' // Missing or invalid parameters
  | 'unauthorized_client' // Client not allowed to use grant type
  | 'unsupported_grant_type' // Grant type not supported
  | 'invalid_scope' // Requested scope is invalid/unknown

export const OAUTH2_ERROR_CODES: OAuth2ErrorCode[] = [
  'invalid_grant',
  'invalid_client',
  'invalid_request',
  'unauthorized_client',
  'unsupported_grant_type',
  'invalid_scope',
]

/**
 * Extracts a known OAuth2 error code from an error thrown by the identity server
 * (e.g. a FetchError whose `body.error` is `invalid_grant`), or returns undefined
 * if the error is not a recognized OAuth2 error.
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
 */
export const getOAuth2ErrorCode = (
  error: unknown,
): OAuth2ErrorCode | undefined => {
  const code = (error as { body?: { error?: string } })?.body?.error

  return code && OAUTH2_ERROR_CODES.includes(code as OAuth2ErrorCode)
    ? (code as OAuth2ErrorCode)
    : undefined
}

@Injectable()
export class ErrorService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cacheService: CacheService,
    private readonly sessionCookieService: SessionCookieService,
  ) {}

  /**
   * Handles authorization errors by cleaning up user session and logging the error
   *
   * @param params Object containing error handling parameters
   * @param params.res - Express Response object for clearing cookies
   * @param params.sid - Session ID of the user
   * @param params.operation - Name of the operation that failed (e.g., 'get user', 'refresh token')
   * @param params.error - The error that was caught
   * @param params.tokenResponseKey - Redis key for the token that needs to be cleaned up
   *
   * @throws UnauthorizedException after cleanup is complete
   */
  async handleAuthorizedError({
    res,
    operation,
    error,
    tokenResponseKey,
  }: {
    res: Response
    operation: string
    error: unknown
    tokenResponseKey: string
  }): Promise<never> {
    const errorCode = getOAuth2ErrorCode(error)

    // If the error is an OAuth2 error
    // 1. Delete the cached token response
    // 2. Clear the session cookie
    // 3. Throw an UnauthorizedException
    if (errorCode) {
      this.logger.warn(
        `${operation} failed with OAuth2 error: ${errorCode}`,
        error,
      )

      this.sessionCookieService.clear(res)
      await this.cacheService.delete(tokenResponseKey)

      throw new UnauthorizedException()
    }

    throw error
  }
}
