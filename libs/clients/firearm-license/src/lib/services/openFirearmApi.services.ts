import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import { FirearmApplicationApi, LicenseInfo } from '../../../gen/fetch'
import { OPEN_FIREARM_APPLICATION_API } from '../firearmApi.types'

@Injectable()
export class OpenFirearmApi {
  constructor(
    @Inject(OPEN_FIREARM_APPLICATION_API)
    private readonly api: FirearmApplicationApi,
  ) {}

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
