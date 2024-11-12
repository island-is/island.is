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
import { PubSubService } from '../pubsub/pubsub.service'

const REFRESH_COMPLETE = 'refresh_complete'
const REFRESH_FAILED = 'refresh_failed'
const REFRESH_TIMEOUT = 10000 // 10 seconds

@Injectable()
export class UserService {
  private refreshTokenInProgress: Set<string> = new Set()

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
    private readonly pubSubService: PubSubService,
  ) {}

  private mapToBffUser(value: CachedTokenResponse): BffUser {
    return {
      scopes: value.scopes,
      profile: value.userProfile,
    }
  }

  /**
   * Creates a timeout promise that always rejects after specified time
   *
   * @param ms - Timeout in milliseconds
   */
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms),
    )
  }

  /**
   * Waits for the refresh token process to complete.
   *
   * @param channel - The channel to subscribe to.
   */
  private async waitForRefreshCompletion(channel: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pubSubService.subscribe(channel, async (message) => {
        await this.pubSubService.unsubscribe(channel)

        if (message === REFRESH_COMPLETE) {
          resolve()
        } else if (message === REFRESH_FAILED) {
          reject(new UnauthorizedException())
        }
      })
    })
  }

  /**
   * Queues the request to wait for refresh completion or timeout
   * before proceeding. Promise.race is used to wait for either
   * the refresh to complete or the timeout to occur.
   *
   * @param channel - The channel to listen on
   * @throws UnauthorizedException if timeout or refresh fails
   */
  private async queueForRefresh(channel: string): Promise<void> {
    await Promise.race([
      this.waitForRefreshCompletion(channel),
      this.createTimeout(REFRESH_TIMEOUT),
    ])
  }

  public async getUser(req: Request, refresh = true): Promise<BffUser> {
    const sid = req.cookies[SESSION_COOKIE_NAME]
    const channel = `refresh_token_${sid}`

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const cachedTokenResponse =
        await this.cacheService.get<CachedTokenResponse>(
          this.cacheService.createSessionKeyType('current', sid),
          // Do not throw error if the key is not found
          false,
        )

      if (!cachedTokenResponse) {
        throw new UnauthorizedException()
      }

      const accessTokenHasExpired = hasTimestampExpiredInMS(
        cachedTokenResponse.accessTokenExp,
      )

      if (accessTokenHasExpired && !refresh) {
        if (this.refreshTokenInProgress.has(channel)) {
          // Wait for the refresh to complete before proceeding
          await this.queueForRefresh(channel)

          // Get the updated token from cache
          const updatedTokenResponse =
            await this.cacheService.get<CachedTokenResponse>(
              this.cacheService.createSessionKeyType('current', sid),
              false,
            )

          if (!updatedTokenResponse) {
            throw new UnauthorizedException()
          }

          return this.mapToBffUser(updatedTokenResponse)
        }

        // Start the process of refreshing the token
        this.refreshTokenInProgress.add(channel)

        try {
          // Get new token data with refresh token
          const tokenResponse = await this.idsService.refreshToken(
            cachedTokenResponse.encryptedRefreshToken,
          )

          if (tokenResponse.type === 'error') {
            this.logger.error('Failed to refresh token')
            // Notify waiting requests about the failure
            await this.pubSubService.publish({
              channel,
              message: REFRESH_FAILED,
            })

            throw tokenResponse.data
          }

          // Update cache with new token data
          const value: CachedTokenResponse =
            await this.authService.updateTokenCache(tokenResponse.data)

          // Publish refresh complete message
          await this.pubSubService.publish({
            channel,
            message: REFRESH_COMPLETE,
          })

          return this.mapToBffUser(value)
        } finally {
          // Ensure clean up
          this.refreshTokenInProgress.delete(channel)
        }
      }

      return this.mapToBffUser(cachedTokenResponse)
    } catch (error) {
      this.logger.error('Get user error: ', error)

      throw new UnauthorizedException()
    }
  }
}
