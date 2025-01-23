import { Injectable } from '@nestjs/common'
import {
  RevokeLicenseRequest,
  RevokeLicenseResponse,
  UpdateLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { LicenseApiVersion, LicenseId } from './license.types'
import { LicenseServiceV1 } from './licenseV1.service'
import { LicenseServiceV2 } from './licenseV2.service'

@Injectable()
export class LicenseService {
  constructor(
    private readonly serviceV1: LicenseServiceV1,
    private readonly serviceV2: LicenseServiceV2,
  ) {}

  private readonly serviceMap = {
    [LicenseApiVersion.v1]: this.serviceV1,
    [LicenseApiVersion.v2]: this.serviceV2,
  }

  private getService = (apiVersion?: LicenseApiVersion) =>
    apiVersion ? this.serviceMap[apiVersion] : this.serviceV1

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = this.getService(inputData.apiVersion)
    return service.updateLicense(licenseId, nationalId, inputData)
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData?: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const service = this.getService(inputData?.apiVersion)
    return service.revokeLicense(licenseId, nationalId, inputData)
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const service = this.getService(inputData?.apiVersion)
    return service.verifyLicense(inputData)
  }
}
