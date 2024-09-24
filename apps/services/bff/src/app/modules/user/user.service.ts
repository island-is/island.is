import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { BffUser } from '@island.is/shared/types'
import { isExpired } from '../../utils/is-expired'
import { AuthService } from '../auth/auth.service'
import { CachedTokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
    private readonly authService: AuthService,
  ) {}

  private formatUserResponse(value: CachedTokenResponse): BffUser {
    return {
      scope: value.scope,
      scopes: value.scopes,
      profile: {
        ...value.userProfile,
        ...(value.userProfile.birthdate && {
          dateOfBirth: new Date(value.userProfile.birthdate),
        }),
      },
    }
  }

  public async getUser(req: Request): Promise<BffUser> {
    const sid = req.cookies['sid']

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const cachedTokenResponse =
        await this.cacheService.get<CachedTokenResponse>(
          this.cacheService.createSessionKeyType('current', sid),
        )

      // Check if the access token is expired
      if (isExpired(cachedTokenResponse.accessTokenExp)) {
        // Get new token data with refresh token
        const tokenResponse = await this.idsService.refreshToken(
          cachedTokenResponse.refresh_token,
        )

        // Update cache with new token data
        const value: CachedTokenResponse =
          await this.authService.updateTokenCache(tokenResponse)

        return this.formatUserResponse(value)
      }

      return this.formatUserResponse(cachedTokenResponse)
    } catch (error) {
      this.logger.error('Get user error: ', error)

      throw new UnauthorizedException()
    }
  }
}
