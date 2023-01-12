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

  async updateLicense(
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = await this.clientFactory(inputData.licenseId)

    //SPLIT INTO SEPARATE FUNCTIONS
    let updateData: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      /** PUSH - Update electronic license with provided data
       * 1. Parse and validate provided data
       * 2. Map the data to the approriate type
       * 3. Update the license with the mapped data
       */

      if (!inputData.expiryDate)
        throw new BadRequestException(
          'Invalid request body, missing expiryDate',
        )

      let updatePayload: PassDataInput = {
        expirationDate: inputData.expiryDate,
      }

      if (inputData.payload) {
        let parsedInputPayload
        try {
          parsedInputPayload = JSON.parse(inputData.payload)
        } catch (e) {
          throw new BadRequestException('Unable to parse payload')
        }
        updatePayload = {
          ...updatePayload,
          ...parsedInputPayload,
        }
      }

      updateData = await service.update(updatePayload, inputData.nationalId)
    } else {
      /** PULL - Update electronic license with pulled data from service
       * 1. Fetch data from TR
       * 2. Parse and validate license data
       * 3. With good data, update the electronic license with the validated license data!
       */
      updateData = {
        ok: true,
        data: undefined,
      }
    }
    if (updateData?.ok) {
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
