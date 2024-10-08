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

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    if (inputData.apiVersion === LicenseApiVersion.v1) {
      return this.serviceV2.updateLicense(licenseId, nationalId, inputData)
    }
    return this.serviceV1.updateLicense(licenseId, nationalId, inputData)
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData?: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    if (inputData?.apiVersion === LicenseApiVersion.v2) {
      return this.serviceV2.revokeLicense(licenseId, nationalId, inputData)
    }
    return this.serviceV1.revokeLicense(licenseId, nationalId, inputData)
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    if (inputData?.apiVersion === LicenseApiVersion.v2) {
      return this.serviceV2.verifyLicense(inputData)
    }
    return this.serviceV1.verifyLicense(inputData)
  }
}
