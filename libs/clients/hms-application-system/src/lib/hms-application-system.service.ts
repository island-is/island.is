import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ApplicationDto,
  ApplicationApi,
  ApplicationManagerApi,
  BaseAPI,
} from '../../gen/fetch'

@Injectable()
export class HmsApplicationSystemService {
  constructor(
    private readonly applicationApi: ApplicationApi,
    private readonly applicationManagerApi: ApplicationManagerApi,
  ) {}

  private apiWithAuth = <T extends BaseAPI>(api: T, user: User): T =>
    api.withMiddleware(new AuthMiddleware(user as Auth))

  async submitBrunabotamatApplication(user: User, input: ApplicationDto) {
    const res = await this.apiWithAuth(
      this.applicationApi,
      user,
    ).apiApplicationPost({
      applicationDto: input,
    })

    return res
  }
}
