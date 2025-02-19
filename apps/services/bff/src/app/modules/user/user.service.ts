import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'

import { BffUser } from '@island.is/shared/types'

import { ErrorService } from '../../services/error.service'
import { SessionCookieService } from '../../services/sessionCookie.service'
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
    private readonly sessionCookieService: SessionCookieService,
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
    const sid = this.sessionCookieService.get(req)

    if (!sid) {
      throw new UnauthorizedException()
    }

    const tokenResponseKey = this.cacheService.createSessionKeyType(
      'current',
      sid,
    )

    try {
      let cachedTokenResponse: CachedTokenResponse | null =
        await this.cacheService.get<CachedTokenResponse>(
          tokenResponseKey,
          // Don't throw if the key is not found
          false,
        )

      if (
        cachedTokenResponse &&
        hasTimestampExpiredInMS(cachedTokenResponse.accessTokenExp) &&
        refresh
      ) {
        cachedTokenResponse = await this.tokenRefreshService.refreshToken({
          cacheKey: sid,
          encryptedRefreshToken: cachedTokenResponse.encryptedRefreshToken,
        })
      }

      if (!cachedTokenResponse) {
        throw new UnauthorizedException()
      }

      return this.mapToBffUser(cachedTokenResponse)
    } catch (error) {
      return this.errorService.handleAuthorizedError({
        error,
        res,
        tokenResponseKey,
        operation: `${UserService.name}.getUser`,
      })
    }
  }
}
