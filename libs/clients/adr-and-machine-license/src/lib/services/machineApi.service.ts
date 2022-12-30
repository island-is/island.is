import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { VinnuvelaApi, VinnuvelaDto } from '../..'

@Injectable()
export class MachineLicenseService {
  constructor(private readonly api: VinnuvelaApi) {}

  private machineApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getLicenseInfo(user: User): Promise<VinnuvelaDto | null> {
    const licenseInfo = await this.machineApiWithAuth(user).getVinnuvela()
    return licenseInfo
  }
}
