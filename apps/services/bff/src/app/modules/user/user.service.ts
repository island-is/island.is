import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { BffUser } from '@island.is/shared/types'
import { SESSION_COOKIE_NAME } from '../../constants/cookies'
import { CryptoService } from '../../services/crypto.service'

import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { AuthService } from '../auth/auth.service'
import { CachedTokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cryptoService: CryptoService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
    private readonly authService: AuthService,
  ) {}

  private mapToBffUser(value: CachedTokenResponse): BffUser {
    return {
      scopes: value.scopes,
      profile: value.userProfile,
    }
  }

  public async getUser(req: Request, refresh = true): Promise<BffUser> {
    const sid = req.cookies[SESSION_COOKIE_NAME]

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
        // Get new token data with refresh token
        const tokenResponse = await this.idsService.refreshToken(
          cachedTokenResponse.encryptedRefreshToken,
        )

        if (tokenResponse.type === 'error') {
          throw tokenResponse.data
        }

        // Update cache with new token data
        const value: CachedTokenResponse =
          await this.authService.updateTokenCache(tokenResponse.data)

        return this.mapToBffUser(value)
      }

      return this.mapToBffUser(cachedTokenResponse)
    } catch (error) {
      this.logger.error('Get user error: ', error)

      throw new UnauthorizedException()
    }
  }
}
