import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { DefaultApi, OrorkuSkirteini } from '../../gen/fetch'

@Injectable()
export class DisabilityLicenseService {
  constructor(private readonly disabilityLicenseApi: DefaultApi) {}

  private disabilityApiWithAuth = (user: User) =>
    this.disabilityLicenseApi.withMiddleware(new AuthMiddleware(user as Auth))

  async hasDisabilityLicense(user: User): Promise<boolean> {
    const { erOryrki } = await this.disabilityApiWithAuth(user).erOryrkiGet()
    return erOryrki
  }

  async getDisabilityLicense(user: User): Promise<OrorkuSkirteini> {
    const licenseInfo = await this.disabilityApiWithAuth(user).faskirteiniGet()
    return licenseInfo
  }
}
