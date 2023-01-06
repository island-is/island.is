import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
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
  VerifyLicenseResponse,
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

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)

    const verifyData = await service.verify(inputData.barcodeData)

    if (verifyData.ok) {
      return { valid: verifyData.data.valid }
    }

    const code = verifyData.error.code
    // code < 10 means malformed request
    if (code < 10) {
      throw new BadRequestException(verifyData.error.message)
    }
    throw new InternalServerErrorException(verifyData.error.message)
  }
}
