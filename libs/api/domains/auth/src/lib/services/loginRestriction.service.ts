import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { MeLoginRestrictionsApi } from '@island.is/clients/auth/delegation-api'

import { LoginRestriction } from '../models/loginRestriction.model'

@Injectable()
export class LoginRestrictionService {
  constructor(
    private readonly meLoginRestrictionsApi: MeLoginRestrictionsApi,
  ) {}

  meLoginRestrictionsApiWithAuth(auth: Auth): MeLoginRestrictionsApi {
    return this.meLoginRestrictionsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getLoginRestriction(user: User): Promise<LoginRestriction> {
    const response = await this.meLoginRestrictionsApiWithAuth(
      user,
    ).meLoginRestrictionsControllerFindAllV1()
    return {
      restricted: response.data.length > 0,
      until: response.data[0]?.until,
    }
  }

  async createLoginRestriction(
    user: User,
    until: Date,
  ): Promise<LoginRestriction> {
    const response = await this.meLoginRestrictionsApiWithAuth(
      user,
    ).meLoginRestrictionsControllerCreateV1({
      createLoginRestrictionDto: {
        until,
      },
    })

    return {
      // If the REST request fails it will throw and not reach this point.
      restricted: true,
      until: response.until,
    }
  }

  async removeLoginRestriction(user: User): Promise<boolean> {
    await this.meLoginRestrictionsApiWithAuth(
      user,
    ).meLoginRestrictionsControllerDeleteV1()

    // If the REST request fails it will throw and not reach this point.
    return true
  }
}
