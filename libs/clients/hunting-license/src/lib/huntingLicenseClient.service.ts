import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PermitsApi } from '../../gen/fetch'
import {
  HuntingLicenseDto,
  mapHuntingLicenseDto,
} from './huntingLicenseClient.types'

@Injectable()
export class HuntingLicenseClientService {
  constructor(private readonly api: PermitsApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  async getPermits(user: User): Promise<HuntingLicenseDto | null> {
    const data = await this.apiWithAuth(user).permitHunting({
      xQueryNationalId: user.nationalId,
    })

    return mapHuntingLicenseDto(data)
  }
}
