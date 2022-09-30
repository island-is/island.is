import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../gen/fetch'

@Injectable()
export class FirearmApi {
  constructor(private readonly api: FirearmApplicationApi) {}

  private firearmApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getLicenseInfo(user: User): Promise<LicenseInfo | null> {
    const licenseInfo = await this.firearmApiWithAuth(user)
      .apiFirearmApplicationLicenseInfoGet()
      .catch(handle404)
    return licenseInfo
  }

  public async getPropertyInfo(
    user: User,
  ): Promise<FirearmPropertyList | null> {
    const propertyInfo = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiFirearmApplicationPropertyInfoGet({ pageNumber: 1, pageSize: 50 })
      .catch(handle404)
    return propertyInfo
  }
  public async getCategories(): Promise<{ [key: string]: string }> {
    const categories = await this.api.apiFirearmApplicationCategoriesGet()
    return categories
  }
}
