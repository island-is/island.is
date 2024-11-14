import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
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
  private static POLL_INTERVAL = 100 // ms
  private static MAX_POLL_TIME = 3000 // 3 seconds

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
  ) {}

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
  }) {
    // Set refresh in progress
    await this.cacheService.save({
      key: refreshTokenKey,
      value: true,
      ttl: TokenRefreshService.MAX_POLL_TIME,
    })

    const tokenResponse = await this.idsService.refreshToken(
      encryptedRefreshToken,
    )

    // Update cache with new token data
    const updatedTokenResponse = await this.authService.updateTokenCache(
      tokenResponse,
    )

    // Delete the refresh token key to signal that the refresh operation is complete
    await this.cacheService.delete(refreshTokenKey)

    return updatedTokenResponse
  }

  /**
   * Polls the cache to check if a refresh token operation has completed
   * This prevents multiple concurrent refresh token requests and ensures
   * all requests wait for the ongoing refresh to complete
   *
   * @param sid - Session ID
   *
   * @returns Promise that resolves when refresh is complete or rejects on timeout
   * @throws Rejects if polling times out or encounters an error
   */
  private async pollForRefreshCompletion(sid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearInterval(pollInterval)
        reject(
          new Error(
            `Polling timed out for token refresh completion for session ${sid}`,
          ),
        )
      }, TokenRefreshService.MAX_POLL_TIME)

      const pollInterval = setInterval(async () => {
        try {
          const refreshTokenInProgress = await this.cacheService.get<boolean>(
            this.createRefreshTokenKey(sid),
            false,
          )

          if (!refreshTokenInProgress) {
            clearInterval(pollInterval)
            clearTimeout(timeoutId)
            resolve()
          }
        } catch (error) {
          clearInterval(pollInterval)
          clearTimeout(timeoutId)
          reject(new Error(`Error polling for refresh completion: ${error}`))
        }
      }, TokenRefreshService.POLL_INTERVAL)
    })
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
    sid,
    encryptedRefreshToken,
  }: {
    sid: string
    encryptedRefreshToken: string
  }): Promise<CachedTokenResponse> {
    const refreshTokenKey = this.createRefreshTokenKey(sid)
    const tokenResponseKey = this.createTokenResponseKey(sid)

    try {
      // Check if refresh is already in progress
      const refreshTokenInProgress = await this.cacheService.get<boolean>(
        refreshTokenKey,
        false,
      )

      if (refreshTokenInProgress) {
        try {
          // Wait for the ongoing refresh to complete
          await this.pollForRefreshCompletion(sid)

          // Get the updated token response from cache
          const tokenResponse =
            await this.cacheService.get<CachedTokenResponse>(tokenResponseKey)

          return tokenResponse
        } catch (error) {
          this.logger.error(error)

          // If polling times out, then retry the refresh
          const updatedTokenResponse = await this.executeTokenRefresh({
            refreshTokenKey,
            encryptedRefreshToken,
          })

          return updatedTokenResponse
        }
      }

      const updatedTokenResponse = await this.executeTokenRefresh({
        refreshTokenKey,
        encryptedRefreshToken,
      })

      return updatedTokenResponse
    } catch (error) {
      this.logger.error(`Token refresh failed for sid: ${sid}`)

      throw error
    }
  }
}
