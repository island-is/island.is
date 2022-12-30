import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { AdrApi, AdrDto } from '../..'

@Injectable()
export class AdrLicenseService {
  constructor(private readonly api: AdrApi) {}

  private adrApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getLicenseInfo(user: User): Promise<AdrDto | null> {
    const licenseInfo = await this.adrApiWithAuth(user).getAdr()
    return licenseInfo
  }
}
