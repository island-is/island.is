import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { CachedTokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'
import { Observable } from 'rxjs'
import { IdsService } from '../ids/ids.service'

@Injectable()
export class ProxyService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
  ) {}

  public async proxyRequest(req: Request): Promise<any> {
    //Promise<Observable<any>> {
    const sid = req.cookies['sid']

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      // TODO this is a work in progress
      // A proxy for the [island.is](http://island.is) GraphQL API, which:

      // 1. Reads session information from redis using session cookie.
      // 2. Performs token refresh using the refresh token if the access token is expired.
      // 3. Forwards request parameters to the GraphQL API endpoint, including the user’s access token.
      // 4. Returns 401 if token refresh fails or no session information is found.

      const cachedTokenResponse =
        await this.cacheService.get<CachedTokenResponse>(
          this.cacheService.createSessionKeyType('current', sid),
        )

      // Check if the access token is expired

      if (cachedTokenResponse.expires_in) {
        // Refresh the token
        const newTokenResponse = await this.idsService.refreshToken(
          cachedTokenResponse.refresh_token,
        )

        console.log('newTokenResponse', newTokenResponse)
      }

      if (!cachedTokenResponse.userProfile) {
        throw new Error('userProfile not found in cache')
      }

      //return cachedTokenResponse.userProfile
    } catch (error) {
      this.logger.error('Error getting user from cache: ', error)

      throw new UnauthorizedException()
    }
  }
}
