import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class DisabilityLicenseService {
  constructor(private disabilityLicenseApi: DefaultApi) {}

  async hasDisabilityLicense(user: User): Promise<boolean> {
    const { erOryrki } = await this.disabilityLicenseApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .erOryrkiGet()
    return erOryrki
  }
}
