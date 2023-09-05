import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { MinarSidur, StarfsleyfiAMinumSidumApi } from '../../gen/fetch'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthDirectorateClientService {
  constructor(private readonly api: StarfsleyfiAMinumSidumApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getHealthDirectorateLicense(
    user: User,
  ): Promise<Array<MinarSidur> | null> {
    return this.apiWithAuth(user).starfsleyfiAMinumSidumGet()
  }
}
