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
import { LicenseId, PASS_TEMPLATE_IDS } from './license.types'
import {
  LicenseClientService,
  LicenseType,
} from '@island.is/clients/license-client'
import type { PassTemplateIds } from './license.types'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(PASS_TEMPLATE_IDS) private config: PassTemplateIds,
    private clientFactory: LicenseClientService,
  ) {}

  private async getLicenseClient(licenseId: LicenseId) {
    return await this.clientFactory.getClientByLicenseType(
      (licenseId as unknown) as LicenseType,
    )
  }

  private async pushUpdateLicense(
    licenseId: LicenseId,
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

    const client = await this.getLicenseClient(licenseId)

    if (!client.pushUpdatePass) {
      return {
        ok: false,
        error: {
          code: 99,
          message: 'No method available',
        },
      }
    }

    return await client.pushUpdatePass(updatePayload, nationalId)
  }

  private async pullUpdateLicense(
    licenseId: LicenseId,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from TR
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    const client = await this.getLicenseClient(licenseId)

    if (!client.pullUpdatePass) {
      return {
        ok: false,
        error: {
          code: 99,
          message: 'No method available',
        },
      }
    }

    return await client.pullUpdatePass(nationalId)
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload } = inputData

      if (!expiryDate)
        throw new BadRequestException(
          'Invalid request body, missing expiryDate',
        )

      updateRes = await this.pushUpdateLicense(
        licenseId,
        expiryDate,
        nationalId,
        payload,
      )
    } else {
      updateRes = await this.pullUpdateLicense(licenseId, nationalId)
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
    const client = await this.getLicenseClient(licenseId)

    if (!client.revokePass) {
      throw new InternalServerErrorException('Invalid method invocation')
    }

    const revokeData = await client.revokePass(nationalId)

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
      throw new BadRequestException('Missing passTemplateId')
    }

    const licenseId = this.getTypeFromPassTemplateId(passTemplateId)

    if (!licenseId) {
      throw new InternalServerErrorException('PassTemplateID parsing failed')
    }

    const client = await this.getLicenseClient(licenseId)

    if (!client.verifyPass) {
      throw new InternalServerErrorException('Service verify failure')
    }
    const verifyData = await client.verifyPass(inputData.barcodeData)

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
