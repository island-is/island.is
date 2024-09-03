import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { CachedTokenResponse, IdTokenData } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cacheService: CacheService,
  ) {}

  public async getUser(req: Request): Promise<IdTokenData> {
    const sid = req.cookies['sid']

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const cachedTokenResponse =
        await this.cacheService.get<CachedTokenResponse>(
          this.cacheService.createSessionKeyType('current', sid),
        )

      if (!cachedTokenResponse.userProfile) {
        throw new Error('userProfile not found in cache')
      }

      return cachedTokenResponse.userProfile
    } catch (error) {
      this.logger.error('Error getting user from cache: ', error)

      throw new UnauthorizedException()
    }
  }
}
