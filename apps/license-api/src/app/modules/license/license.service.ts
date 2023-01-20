import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  UpdateLicenseRequest,
  RevokeLicenseRequest,
  VerifyLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseResponse,
  RevokeLicenseResponse,
} from './dto'
import { Pass, PassDataInput, Result } from '@island.is/clients/smartsolutions'
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
} from './license.types'

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

  private async pushUpdateLicense(
    service: GenericLicenseClient,
    expirationDate: string,
    nationalId: string,
    payload?: string,
  ): Promise<Result<Pass | undefined>> {
    let updatePayload: PassDataInput = {
      expirationDate,
    }

    if (payload) {
      let parsedInputPayload
      try {
        parsedInputPayload = JSON.parse(payload)
      } catch (e) {
        throw new BadRequestException('Unable to parse payload')
      }
      updatePayload = {
        ...updatePayload,
        ...parsedInputPayload,
      }
    }

    return await service.pushUpdate(updatePayload, nationalId)
  }

  private async pullUpdateLicense(
    service: GenericLicenseClient,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from TR
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    return await service.pullUpdate(nationalId)
  }

  async updateLicense(
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)

    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload, nationalId } = inputData

      if (!expiryDate)
        throw new BadRequestException(
          'Invalid request body, missing expiryDate',
        )

      updateRes = await this.pushUpdateLicense(
        service,
        expiryDate,
        nationalId,
        payload,
      )
    } else {
      updateRes = await this.pullUpdateLicense(service, inputData.nationalId)
    }

    if (updateRes.ok) {
      return {
        updateSuccess: true,
        data: updateRes.data,
      }
    }
    // code < 10 means malformed request
    if (updateRes.error.code < 10) {
      throw new BadRequestException(updateRes.error.message)
    }
    throw new InternalServerErrorException(updateRes.error.message)
  }

  async revokeLicense(
    inputData: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)
    const revokeData = await service.revoke(inputData.nationalId)

    if (revokeData.ok) {
      return { revokeSuccess: revokeData.data.success }
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

    const { barcodeData, nationalId } = inputData
    const verifyData = await service.verify(barcodeData, nationalId)

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
