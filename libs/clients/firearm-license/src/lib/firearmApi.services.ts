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

  public async getLicenseData(ssn: string): Promise<LicenseData> {
    const data = await Promise.all([
      this.api.apiFirearmApplicationLicenseInfoSsnGet({
        ssn,
      }),
      this.api.apiFirearmApplicationPropertyInfoSsnGet({
        ssn,
      }),
      this.api.apiFirearmApplicationCategoriesGet(),
    ])

    const license: LicenseData = {
      licenseInfo: data[0],
      properties: data[1],
      categories: data[2],
    }

    return license
  }

  public async getLicenseInfo(ssn: string): Promise<LicenseInfo> {
    const licenseInfo = await this.api.apiFirearmApplicationLicenseInfoSsnGet({
      ssn,
    })
    return licenseInfo
  }

  public async getPropertyInfo(ssn: string): Promise<FirearmPropertyList> {
    const propertyInfo = await this.api.apiFirearmApplicationPropertyInfoSsnGet(
      {
        ssn,
      },
    )
    return propertyInfo
  }
  public async getCategories(): Promise<{ [key: string]: string }> {
    const categories = await this.api.apiFirearmApplicationCategoriesGet()
    return categories
  }
}
