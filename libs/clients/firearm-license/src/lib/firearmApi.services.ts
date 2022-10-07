import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../gen/fetch'
import { LicenseData } from './firearmApi.types'

@Injectable()
export class FirearmApi {
  constructor(private readonly api: FirearmApplicationApi) {}

  public async getLicenseData(user: User): Promise<LicenseData> {
    const licenseInfo = await this.getLicenseInfo(user)
    const properties = await this.getPropertyInfo(user)
    const categories = await this.getCategories(user)

    const licenseData: LicenseData = {
      licenseInfo,
      properties,
      categories,
    }

    return licenseData
  }

  public async getLicenseInfo(user: User): Promise<LicenseInfo> {
    const licenseInfo = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiFirearmApplicationLicenseInfoGet()
    return licenseInfo
  }

  public async getPropertyInfo(user: User): Promise<FirearmPropertyList> {
    const propertyInfo = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiFirearmApplicationPropertyInfoGet({ pageNumber: 1, pageSize: 50 })
    return propertyInfo
  }
  public async getCategories(user: User): Promise<{ [key: string]: string }> {
    const categories = await this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiFirearmApplicationCategoriesGet()
    return categories
  }
}
