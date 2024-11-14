import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'

import { BffUser } from '@island.is/shared/types'
import { SESSION_COOKIE_NAME } from '../../constants/cookies'

import { ErrorService } from '../../services/error.service'
import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { CachedTokenResponse } from '../auth/auth.types'
import { TokenRefreshService } from '../auth/token-refresh.service'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class UserService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly tokenRefreshService: TokenRefreshService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * Maps the cached token response to BFF user format
   */
  private mapToBffUser(value: CachedTokenResponse): BffUser {
    return {
      scopes: value.scopes,
      profile: value.userProfile,
    }
  }

  /**
   * Gets the current user data, refreshing the token if needed
   */
  public async getUser({
    req,
    res,
    refresh = true,
  }: {
    req: Request
    res: Response
    refresh: boolean
  }): Promise<BffUser> {
    const sid = req.cookies[SESSION_COOKIE_NAME]

    if (!sid) {
      throw new UnauthorizedException()
    }

    const tokenResponseKey = this.cacheService.createSessionKeyType(
      'current',
      sid,
    )
    const cachedTokenResponse =
      await this.cacheService.get<CachedTokenResponse>(
        tokenResponseKey,
        // Don't throw if the key is not found
        false,
      )

    try {
      if (!cachedTokenResponse) {
        throw new UnauthorizedException()
      }

      const accessTokenHasExpired = hasTimestampExpiredInMS(
        cachedTokenResponse.accessTokenExp,
      )

      if (accessTokenHasExpired && refresh) {
        const updatedTokenResponse =
          await this.tokenRefreshService.refreshToken({
            sid,
            encryptedRefreshToken: cachedTokenResponse.encryptedRefreshToken,
          })

        return this.mapToBffUser(updatedTokenResponse)
      }

      return this.mapToBffUser(cachedTokenResponse)
    } catch (error) {
      return this.errorService.handleAuthorizedError({
        error,
        res,
        sid,
        tokenResponseKey,
        operation: `${UserService.name}.getUser`,
      })
    }
  }
}
