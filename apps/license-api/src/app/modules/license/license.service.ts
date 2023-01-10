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
  LicenseUpdateUnion,
} from './license.types'
import {
  UpdateLicenseRequest,
  RevokeLicenseRequest,
  VerifyLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseResponse,
  RevokeLicenseResponse,
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
  ): Promise<UpdateLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)
    const data = LicenseUpdateUnion.parse(inputData)
    const updateData = await service.update(data)

    if (updateData.ok) {
      return {
        updateSuccess: true,
        data: updateData.data,
      }
    }

    const code = updateData.error.code
    // code < 10 means malformed request
    if (code < 10) {
      throw new BadRequestException(updateData.error.message)
    }
    throw new InternalServerErrorException(updateData.error.message)
  }

  async revokeLicense(
    inputData: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)
    const revokeData = await service.revoke(inputData.nationalId)

    if (revokeData.ok) {
      return { revokeSuccess: revokeData.data.voidSuccess }
    }

    const code = revokeData.error.code
    // code < 10 means malformed request
    if (code < 10) {
      throw new BadRequestException(revokeData.error.message)
    }
    throw new InternalServerErrorException(revokeData.error.message)
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
