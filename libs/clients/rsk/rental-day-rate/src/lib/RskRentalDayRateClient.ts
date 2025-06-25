import { Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'

import { Configuration, DayRateApi } from '../../gen/fetch'

@Injectable()
export class RskRentalDayRateClient {
  private defaultApi: DayRateApi
  private configuration: Configuration

  constructor(config: Configuration) {
    this.defaultApi = new DayRateApi(config)
    this.configuration = config
  }

  defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDefaultRequestHeaders(user: User) {
    return {
      xRoadClient: this.configuration.headers?.['X-Road-Client'] ?? '',
      authorization: user.authorization,
    }
  }
}
