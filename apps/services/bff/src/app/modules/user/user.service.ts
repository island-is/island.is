import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { BffUser } from '@island.is/shared/types'
import { SESSION_COOKIE_NAME } from '../../constants/cookies'

import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { AuthService } from '../auth/auth.service'
import { CachedTokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'

@Injectable()
export class UserService {
  private static POLL_INTERVAL = 500 // ms
  private static MAX_POLL_TIME = 3000 // 3 seconds

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
  ) {}

  private mapToBffUser(value: CachedTokenResponse): BffUser {
    return {
      scopes: value.scopes,
      profile: value.userProfile,
    }
  }

  private createRefreshTokenKey(sid: string): string {
    return `refresh_token_in_progress:${sid}`
  }

  private createTokenResponseKey(sid: string): string {
    return this.cacheService.createSessionKeyType('current', sid)
  }

  /**
   * Polls Redis until refresh token is finished or max poll time is reached
   *
   * @param sid - Session ID
   * @throws UnauthorizedException if polling times out or refresh fails
   */
  private async pollForRefreshCompletion(sid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearInterval(pollInterval)
        reject()
      }, UserService.MAX_POLL_TIME)

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
          this.logger.error('Error polling for refresh completion', error)
          clearInterval(pollInterval)
          clearTimeout(timeoutId)
          reject()
        }
      }, UserService.POLL_INTERVAL)
    })
  }

  public async getUser(req: Request, refresh = true): Promise<BffUser> {
    const sid = req.cookies[SESSION_COOKIE_NAME]

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const tokenResponseKey = this.createTokenResponseKey(sid)

      const cachedTokenResponse =
        await this.cacheService.get<CachedTokenResponse>(
          tokenResponseKey,
          false,
        )

      if (!cachedTokenResponse) {
        throw new UnauthorizedException()
      }

      const accessTokenHasExpired = hasTimestampExpiredInMS(
        cachedTokenResponse.accessTokenExp,
      )

      if (accessTokenHasExpired && !refresh) {
        const refreshTokenKey = this.createRefreshTokenKey(sid)

        try {
          // Check if refresh is already in progress
          const refreshTokenInProgress = await this.cacheService.get<boolean>(
            refreshTokenKey,
            false,
          )

          if (refreshTokenInProgress) {
            // Wait for the ongoing refresh to complete
            await this.pollForRefreshCompletion(sid)

            // Get the updated token response from cache
            const updatedTokenResponse =
              await this.cacheService.get<CachedTokenResponse>(tokenResponseKey)

            return this.mapToBffUser(updatedTokenResponse)
          }

          // Set refresh in progress
          await this.cacheService.save({
            key: refreshTokenKey,
            value: true,
            ttl: UserService.MAX_POLL_TIME,
          })

          // Get new token data with refresh token
          const tokenResponse = await this.idsService.refreshToken(
            cachedTokenResponse.encryptedRefreshToken,
          )

          if (tokenResponse.type === 'error') {
            throw tokenResponse.data
          }

          // Update cache with new token data
          const value = await this.authService.updateTokenCache(
            tokenResponse.data,
          )

          return this.mapToBffUser(value)
        } catch (error) {
          this.logger.error(`Token refresh failed for sid: ${sid}`)

          throw error
        } finally {
          // Always clean up the refresh token key
          await this.cacheService.delete(refreshTokenKey)
        }
      }

      return this.mapToBffUser(cachedTokenResponse)
    } catch (error) {
      this.logger.error('Get user error:', error)
      throw new UnauthorizedException()
    }
  }
}
