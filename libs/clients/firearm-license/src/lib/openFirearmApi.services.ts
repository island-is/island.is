import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import { FirearmApplicationApi, LicenseInfo } from '../../gen/fetch'

@Injectable()
export class OpenFirearmApi {
  constructor(private readonly api: FirearmApplicationApi) {}

  public async getVerificationLicenseInfo(
    targetNationalId: string,
  ): Promise<LicenseInfo | null> {
    const licenseInfo = await this.api
      .apiFirearmApplicationWithAPIKeyLicenseInfoSsnGet({
        ssn: targetNationalId,
      })
      .catch(handle404)
    return licenseInfo
  }

  public async getVerificationPropertyInfo(
    targetNationalId: string,
  ): Promise<LicenseInfo | null> {
    const propertyInfo = await this.api
      .apiFirearmApplicationWithAPIKeyPropertyInfoSsnGet({
        ssn: targetNationalId,
      })
      .catch(handle404)
    return propertyInfo
  }
}
