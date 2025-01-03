import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'
import { AuthService } from './auth.service'
import { CachedTokenResponse } from './auth.types'

/**
 * Service responsible for handling token refresh operations
 * Provides concurrent request protection and token refresh polling
 */
@Injectable()
export class TokenRefreshService {
  private static POLL_INTERVAL = 200 // ms
  private static MAX_POLL_TIME = 3000 // 3 seconds

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
  ) {}

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Creates a unique key for tracking refresh token operations in progress
   * This key is used to prevent concurrent refresh token requests for the same session
   *
   * @param sid - Session ID
   * @returns Formatted key string for refresh token tracking
   */
  private createRefreshTokenKey(sid: string): string {
    return `refresh_token_in_progress:${sid}`
  }

  /**
   * Creates a key for storing token response data in cache
   * This key is used to store and retrieve the current token data for a session
   *
   * @param sid - Session ID
   * @returns Formatted key string for token response data
   */
  private createTokenResponseKey(sid: string): string {
    return this.cacheService.createSessionKeyType('current', sid)
  }

  /**
   * Executes the token refresh operation and updates the cache
   * This method:
   * 1. Sets a flag in cache to indicate refresh is in progress
   * 2. Requests new tokens from the identity server
   * 3. Updates the cache with the new token data
   * 4. Cleans up the refresh flag
   *
   * @param params.refreshTokenKey - Redis key for tracking refresh status
   * @param params.encryptedRefreshToken - Encrypted refresh token for getting new tokens
   *
   * @returns Promise<CachedTokenResponse> Updated token data
   * @throws Will throw if token refresh fails or cache operations fail
   */
  private async executeTokenRefresh({
    refreshTokenKey,
    encryptedRefreshToken,
  }: {
    refreshTokenKey: string
    encryptedRefreshToken: string
  }): Promise<CachedTokenResponse | null> {
    let tokenResponse: CachedTokenResponse | null = null

    try {
      // Set refresh in progress
      await this.cacheService.save({
        key: refreshTokenKey,
        value: true,
        ttl: TokenRefreshService.MAX_POLL_TIME,
      })

      const newTokenCache = await this.idsService.refreshToken(
        encryptedRefreshToken,
      )
      tokenResponse = await this.authService.updateTokenCache(newTokenCache)
    } catch (error) {
      this.logger.warn('Failed to refresh tokens: ', error)
    } finally {
      await this.cacheService.delete(refreshTokenKey)
    }

    return tokenResponse
  }

  /**
   * Waits for an ongoing refresh operation to complete
   * Uses polling with a maximum wait time
   *
   * @param cacheKey Cached key for tracking refresh status
   */
  private async waitForRefreshCompletion(cacheKey: string): Promise<boolean> {
    let attempts = 0
    // Calculate how many attempts we should make
    // maxAttempts = 3000 / 200 = ~15 ish attempts
    const maxAttempts =
      TokenRefreshService.MAX_POLL_TIME / TokenRefreshService.POLL_INTERVAL

    while (attempts < maxAttempts) {
      const refreshTokenInProgress = await this.cacheService.get<boolean>(
        this.createRefreshTokenKey(cacheKey),
        false,
      )

      // If refresh is no longer in progress, we're done
      if (!refreshTokenInProgress) {
        return true
      }

      // Wait for for POLL_INTERVAL before next attempt
      await this.delay(TokenRefreshService.POLL_INTERVAL)

      attempts++
    }

    // We've made all attempts (~15 attempts in 3 seconds total) and still no success
    this.logger.warn(
      'Polling timed out for token refresh completion for session id (sid)',
    )

    return false
  }

  /**
   * Retrieves and validates token from cache
   * Checks for existence and expiration
   *
   * @param tokenResponseKey - Key in cache service for token response data
   */
  private async getTokenFromCache(
    tokenResponseKey: string,
  ): Promise<CachedTokenResponse | null> {
    const tokenResponse = await this.cacheService.get<CachedTokenResponse>(
      tokenResponseKey,
      false,
    )

    if (!tokenResponse) {
      this.logger.warn('No token response found in cache')

      return null
    }

    if (hasTimestampExpiredInMS(tokenResponse.accessTokenExp)) {
      this.logger.warn('Cached token has expired')

      return null
    }

    return tokenResponse
  }

  /**
   * Handles the complete token refresh process with concurrent request protection
   * This method:
   *
   * 1. Checks if a refresh is already in progress
   * 2. If yes, waits for it to complete
   * 3. If no, initiates a new refresh
   * 4. Updates the cache with new token data
   * 5. Cleans up tracking flags
   *
   * @param params.sid - Session ID
   * @param params.encryptedRefreshToken - Encrypted refresh token to use for getting new tokens
   *
   * @returns Promise resolving to updated token response data
   * @throws Forwards any errors from the refresh process after logging
   */

  public async refreshToken({
    cacheKey,
    encryptedRefreshToken,
  }: {
    cacheKey: string
    encryptedRefreshToken: string
  }): Promise<CachedTokenResponse | null> {
    const refreshTokenKey = this.createRefreshTokenKey(cacheKey)
    const tokenResponseKey = this.createTokenResponseKey(cacheKey)

    // Check if refresh is already in progress
    const refreshTokenInProgress = await this.cacheService.get<boolean>(
      refreshTokenKey,
      false,
    )

    if (refreshTokenInProgress) {
      const refreshCompleted = await this.waitForRefreshCompletion(cacheKey)

      if (refreshCompleted) {
        const cachedToken = await this.getTokenFromCache(tokenResponseKey)

        if (cachedToken) {
          return cachedToken
        }
      }

      // If waiting failed or no valid token found, proceed with new refresh
      this.logger.warn('Retrying token refresh after failed wait')
    }

    const updatedTokenResponse = await this.executeTokenRefresh({
      refreshTokenKey,
      encryptedRefreshToken,
    })

    if (!updatedTokenResponse) {
      this.logger.warn('Token refresh failed')
    }

    return updatedTokenResponse
  }
}
