import { Injectable } from '@nestjs/common'
import {
  RevokeLicenseRequest,
  RevokeLicenseResponse,
  UpdateLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { LicenseId } from './license.types'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { LicenseServiceV1 } from './licenseV1.service'
import { LicenseServiceV2 } from './licenseV2.service'

@Injectable()
export class LicenseService {
  constructor(
    private readonly featureFlagService: FeatureFlagService,
    private readonly serviceV1: LicenseServiceV1,
    private readonly serviceV2: LicenseServiceV2,
  ) {}

  getVersion = async () => {
    const flag = await this.featureFlagService.getValue(
      Features.licensesV2,
      false,
    )
    return flag ? 'v2' : 'v1'
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const version = await this.getVersion()
    if (version === 'v2') {
      return this.serviceV2.updateLicense(licenseId, nationalId, inputData)
    }
    return this.serviceV1.updateLicense(licenseId, nationalId, inputData)
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData?: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const version = await this.getVersion()
    if (version === 'v2') {
      return this.serviceV2.revokeLicense(licenseId, nationalId, inputData)
    }
    return this.serviceV1.revokeLicense(licenseId, nationalId, inputData)
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const version = await this.getVersion()
    if (version === 'v2') {
      return this.serviceV2.verifyLicense(inputData)
    }
    return this.serviceV1.verifyLicense(inputData)
  }
}
