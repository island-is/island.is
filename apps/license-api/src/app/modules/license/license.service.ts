import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
  ServiceResponse,
} from './license.types'
import {
  UpdateLicenseRequest,
  PushUpdateLicenseDto,
  PullUpdateLicenseDto,
  RevokeLicenseRequest,
  VerifyLicenseRequest,
  UpdateLicenseResponse,
  RevokeLicenseResponse,
  LicenseError,
} from './dto'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CLIENT_FACTORY)
    private clientFactory: (
      licenseId: LicenseId,
    ) => Promise<GenericLicenseClient>,
  ) {}

  async updateLicense(
    inputData: UpdateLicenseRequest,
  ): Promise<ServiceResponse<UpdateLicenseResponse>> {
    const service = await this.clientFactory(inputData.licenseId)
    let data
    if (inputData.licenseUpdateType === 'push') {
      // PUSH
      data = inputData as PushUpdateLicenseDto
      //validate payload
      const valid = false
      if (!valid) {
        const error: LicenseError = {
          code: '1',
          message: 'Invalid payload',
        }
        return {
          ok: false,
          error,
        }
      }
    } else {
      // PULL
      data = inputData as PullUpdateLicenseDto
    }
    const updateCall = await service.update()
    this.logger.debug(updateCall)
    return { ok: true, data: inputData }
  }

  async revokeLicense(
    inputData: RevokeLicenseRequest,
  ): Promise<ServiceResponse<RevokeLicenseResponse>> {
    const service = await this.clientFactory(inputData.licenseId)
    const revokeCall = await service.revoke()
    this.logger.debug(revokeCall)
    return { ok: true, data: inputData }
  }

  async verifyLicense(inputData: VerifyLicenseRequest) {
    const service = await this.clientFactory(inputData.licenseId)

    /**
     * VALIDATE PAYLOAD
     * Need to validate the incoming string, supposed to be PDF417 barcode scanner data!
     */

    const valid = false
    if (!valid) {
      const error: LicenseError = {
        code: '1?',
        message: 'Invalid payload',
      }
      return {
        ok: false,
        error,
      }
    }

    return { ok: true, data: inputData }
  }
}
