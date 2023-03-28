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
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
  PASS_TEMPLATE_IDS,
} from './license.types'
import type { PassTemplateIds } from './license.types'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(PASS_TEMPLATE_IDS) private config: PassTemplateIds,
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
    const service = await this.clientFactory(licenseId)

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
    const service = await this.clientFactory(licenseId)
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

    const licenseId = this.getTypeFromPassTemplateId(passTemplateId)

    if (!licenseId) {
      throw new InternalServerErrorException('PassTemplateID parsing failed')
    }

    const service = await this.clientFactory(licenseId)
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

  private getTypeFromPassTemplateId(passTemplateId: string): LicenseId | null {
    for (const [key, value] of Object.entries(this.config)) {
      // some license Config id === barcode id
      if (value === passTemplateId) {
        const keyAsEnumKey = `${key.toUpperCase()}_LICENSE`
        const valueFromEnum: LicenseId | undefined =
          LicenseId[keyAsEnumKey as keyof typeof LicenseId]

        if (!valueFromEnum) {
          throw new Error(`Invalid license type: ${key}`)
        }
        return valueFromEnum
      }
    }
    return null
  }
}
