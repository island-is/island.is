import { Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../gen/fetch'
import { LicenseAndPropertyInfo } from './firearmApi.types'

@Injectable()
export class FirearmApi {
  constructor(private readonly api: FirearmApplicationApi) {}

  public async getLicenseAndPropertyInfo(
    ssn: string,
  ): Promise<LicenseAndPropertyInfo> {
    const data = await Promise.all([
      this.api.apiFirearmApplicationLicenseInfoSsnGet({
        ssn,
      }),
      this.api.apiFirearmApplicationPropertyInfoSsnGet({
        ssn,
      }),
    ])

    const license: LicenseAndPropertyInfo = {
      ...data[0],
      properties: data[1],
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
}
