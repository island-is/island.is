import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { TokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class UserService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cacheService: CacheService,
  ) {}

  public async getUser(req: Request): Promise<string> {
    const sid = req.cookies['sid']

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const user = await this.cacheService.get<TokenResponse>(
        this.cacheService.createSessionKeyType('current', sid),
      )

      if (!user) {
        throw new Error()
      }

      return user.id_token
    } catch (error) {
      this.logger.error('Error getting user from cache: ', error)

      throw new UnauthorizedException()
    }
  }
}
