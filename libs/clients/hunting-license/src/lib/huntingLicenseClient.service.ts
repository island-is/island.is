import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PermitsApi } from '../../gen/fetch'

@Injectable()
export class HuntingLicenseClientService {
  constructor(private readonly api: PermitsApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getPermits(user: User) {
    return this.apiWithAuth(user).permitHunting({
      xQueryNationalId: user.nationalId,
    })
  }
}
