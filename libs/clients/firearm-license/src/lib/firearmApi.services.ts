import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../gen/fetch'

@Injectable()
export class FirearmApi {
  constructor(private readonly api: FirearmApplicationApi) {}

  private firearmApiWithAuth = (user: User) => {
    return this.api.withMiddleware(new AuthMiddleware(user as Auth))
  }

  public async getLicenseInfo(user: User): Promise<LicenseInfo | null> {
    return this.firearmApiWithAuth(user).apiFirearmApplicationLicenseInfoGet()
  }

  public async getPropertyInfo(
    user: User,
  ): Promise<FirearmPropertyList | null> {
    return this.firearmApiWithAuth(user).apiFirearmApplicationPropertyInfoGet({
      pageNumber: 1,
      pageSize: 50,
    })
  }
  public async getCategories(user: User): Promise<{ [key: string]: string }> {
    return this.firearmApiWithAuth(user).apiFirearmApplicationCategoriesGet()
  }
}
