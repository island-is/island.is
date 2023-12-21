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
    ).meLoginRestrictionsControllerFindAll()
    return {
      restricted: response.data.length > 0,
      until: response.data[0]?.restrictedUntil,
    }
  }

  async createLoginRestriction(
    user: User,
    until: Date,
  ): Promise<LoginRestriction> {
    const response = await this.meLoginRestrictionsApiWithAuth(
      user,
    ).meLoginRestrictionsControllerCreate({
      createLoginRestrictionDto: {
        until,
      },
    })

    return {
      // If the rest request fails it will throw and not reach this point.
      restricted: true,
      until: response.restrictedUntil,
    }
  }

  async removeLoginRestriction(user: User): Promise<boolean> {
    await this.meLoginRestrictionsApiWithAuth(
      user,
    ).meLoginRestrictionsControllerDelete()

    // If the rest request fails it will throw and not reach this point.
    return true
  }
}
