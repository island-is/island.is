import { Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'

import { Configuration, RentalDaysApi } from '../../gen/fetch'

@Injectable()
export class RskRentalDaysClient {
  private rentalDaysApi: RentalDaysApi
  private configuration: Configuration

  constructor(config: Configuration) {
    this.rentalDaysApi = new RentalDaysApi(config)
    this.configuration = config
  }

  rentalDaysApiWithAuth(auth: Auth) {
    return this.rentalDaysApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDefaultRequestHeaders(user: User) {
    return {
      xRoadClient: this.configuration.headers?.['X-Road-Client'] ?? '',
      authorization: user.authorization,
    }
  }
}
