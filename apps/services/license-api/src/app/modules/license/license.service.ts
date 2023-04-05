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
  VerifyLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseResponse,
  RevokeLicenseResponse,
} from './dto'
import { Pass, PassDataInput, Result } from '@island.is/clients/smartsolutions'
import { LicenseId } from './license.types'
import {
  BaseLicenseUpdateClient,
  LicenseType,
  LicenseUpdateClientService,
} from '@island.is/clients/license-client'
import { mapLicenseIdToLicenseType } from './utils/mapLicenseId'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly clientService: LicenseUpdateClientService,
  ) {}

  private async getClientByLicenseId(
    licenseId: LicenseId,
  ): Promise<BaseLicenseUpdateClient> {
    const type = mapLicenseIdToLicenseType(licenseId)
    const service = await this.clientService.getLicenseUpdateClientByType(
      type as LicenseType,
    )

    if (!service) {
      this.logger.warn(`Invalid license type`)
      throw new InternalServerErrorException(`Invalid license type`)
    }

    return service
  }

  private async getClientByPassTemplateId(
    passTemplateId: string,
  ): Promise<BaseLicenseUpdateClient> {
    const service = await this.clientService.getLicenseUpdateClientByPassTemplateId(
      passTemplateId,
    )

    if (!service) {
      this.logger.warn(`Invalid pass template id`)
      throw new InternalServerErrorException(`Invalid license type`)
    }

    return service
  }

  private async pushUpdateLicense(
    service: BaseLicenseUpdateClient,
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
    service: BaseLicenseUpdateClient,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from provider
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    return await service.pullUpdate(nationalId)
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = await this.getClientByLicenseId(licenseId)

    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload } = inputData

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
      updateRes = await this.pullUpdateLicense(service, nationalId)
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
    licenseId: LicenseId,
    nationalId: string,
  ): Promise<RevokeLicenseResponse> {
    const service = await this.getClientByLicenseId(licenseId)
    const revokeData = await service.revoke(nationalId)

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
    const { passTemplateId } = JSON.parse(inputData.barcodeData)

    if (!passTemplateId) {
      throw new BadRequestException('Missing passTemplateId from request input')
    }

    const service = await this.getClientByPassTemplateId(passTemplateId)

    const verifyData = await service.verify(inputData.barcodeData)

    if (verifyData.ok) {
      return {
        valid: verifyData.data.valid,
        passIdentity: verifyData.data.passIdentity,
      }
    }

    const code = verifyData.error.code
    // code < 10 means malformed request
    if (code < 10) {
      throw new BadRequestException(verifyData.error.message)
    }
    throw new InternalServerErrorException(verifyData.error.message)
  }
}
