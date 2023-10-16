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
  RevokeLicenseRequest,
} from './dto'
import { Pass, PassDataInput, Result } from '@island.is/clients/smartsolutions'
import { ErrorType, LicenseId } from './license.types'
import {
  BaseLicenseUpdateClient,
  LicenseType,
  LicenseUpdateClientService,
} from '@island.is/clients/license-client'
import { mapLicenseIdToLicenseType } from './utils/mapLicenseId'

const LOG_CATEGORY = 'license-api'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly clientService: LicenseUpdateClientService,
  ) {}

  private getErrorTypeByCode = (code: number): ErrorType =>
    code < 10 ? 'BadRequest' : 'ServerError'

  //Error message is an array to maintain consistency
  private getException = (errorType: ErrorType, details?: string | object) => {
    return errorType === 'BadRequest'
      ? new BadRequestException([details ?? 'Unknown error'])
      : new InternalServerErrorException([details ?? 'Unknown error'])
  }

  private async getClientByLicenseId(
    licenseId: LicenseId,
    requestId?: string,
  ): Promise<BaseLicenseUpdateClient> {
    const type = mapLicenseIdToLicenseType(licenseId)

    this.logger.debug('Retrieving a licence client by license id', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    if (!type) {
      this.logger.error(`Invalid license type`, {
        category: LOG_CATEGORY,
        requestId: requestId,
        type,
      })
      throw new InternalServerErrorException(`Invalid license type`)
    }

    const service = await this.clientService.getLicenseUpdateClientByType(
      type as LicenseType,
      requestId,
    )

    this.logger.debug('Injecting the proper license client..', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    if (!service) {
      this.logger.error(`Client service generation failed`, {
        category: LOG_CATEGORY,
        type,
      })
      throw new InternalServerErrorException(`Client service generation failed`)
    }
    this.logger.debug('Client injection successful', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    return service
  }

  private async getClientByPassTemplateId(
    passTemplateId: string,
    requestId?: string,
  ): Promise<BaseLicenseUpdateClient> {
    this.logger.debug('Retrieving a licence client by pass template id', {
      category: LOG_CATEGORY,
      requestId: requestId,
      passTemplateId,
    })

    const service =
      await this.clientService.getLicenseUpdateClientByPassTemplateId(
        passTemplateId,
        requestId,
      )

    this.logger.debug('Injecting the proper license client..', {
      category: LOG_CATEGORY,
      requestId: requestId,
      passTemplateId,
    })

    if (!service) {
      this.logger.error(`Client service generation failed`, {
        category: LOG_CATEGORY,
        requestId: requestId,
        passTemplateId,
      })
      throw new InternalServerErrorException(`Client service generation failed`)
    }

    return service
  }

  private async pushUpdateLicense(
    service: BaseLicenseUpdateClient,
    expirationDate: string,
    nationalId: string,
    payload?: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    let updatePayload: PassDataInput = {
      expirationDate,
    }

    if (payload) {
      let parsedInputPayload
      try {
        parsedInputPayload = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Unable to parse payload', {
          category: LOG_CATEGORY,
          updateType: 'push',
          requestId,
        })
        throw this.getException(
          'BadRequest',
          'Unable to parse payload for push update',
        )
      }
      updatePayload = {
        ...updatePayload,
        ...parsedInputPayload,
      }
    }

    this.logger.debug('Update input parse successful, executing update', {
      category: LOG_CATEGORY,
      updateType: 'push',
      requestId,
    })

    return await service.pushUpdate(updatePayload, nationalId)
  }

  private async pullUpdateLicense(
    service: BaseLicenseUpdateClient,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from provider
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    this.logger.debug('Executing update', {
      category: LOG_CATEGORY,
      updateType: 'pull',
      requestId,
    })

    return await service.pullUpdate(nationalId)
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const service = await this.getClientByLicenseId(licenseId)

    this.logger.debug('Updating license', {
      category: LOG_CATEGORY,
      requestId: inputData.requestId,
      updateType: inputData.licenseUpdateType,
    })

    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload } = inputData

      if (!expiryDate) {
        this.logger.warn('Invalid request body, missing expiryDate', {
          category: LOG_CATEGORY,
          requestId: inputData.requestId,
          updateType: inputData.licenseUpdateType,
        })

        throw this.getException(
          'BadRequest',
          'Invalid request body, missing expiryDate',
        )
      }
      updateRes = await this.pushUpdateLicense(
        service,
        expiryDate,
        nationalId,
        payload,
        inputData.requestId,
      )
    } else {
      updateRes = await this.pullUpdateLicense(
        service,
        nationalId,
        inputData.requestId,
      )
    }

    if (updateRes.ok) {
      this.logger.debug('update license successful', {
        category: LOG_CATEGORY,
        requestId: inputData.requestId,
        updateType: inputData.licenseUpdateType,
      })
      return {
        updateSuccess: true,
        data: updateRes.data,
      }
    }

    this.logger.error('Update license failed', {
      category: LOG_CATEGORY,
      requestId: inputData.requestId,
      ...updateRes.error,
    })

    throw this.getException(
      this.getErrorTypeByCode(updateRes.error.code),
      updateRes.error.message,
    )
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData?: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const service = await this.getClientByLicenseId(licenseId)
    const revokeRes = await service.revoke(nationalId, inputData?.requestId)

    if (revokeRes.ok) {
      this.logger.debug('revoke license succeeded', {
        category: LOG_CATEGORY,
        requestId: inputData?.requestId,
      })
      return { revokeSuccess: revokeRes.data.success }
    }

    this.logger.error('Revoke license failed', {
      category: LOG_CATEGORY,
      requestId: inputData?.requestId,
      ...revokeRes.error,
    })
    throw this.getException(
      this.getErrorTypeByCode(revokeRes.error.code),
      revokeRes.error.message,
    )
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const { passTemplateId } = JSON.parse(inputData.barcodeData)

    if (!passTemplateId) {
      this.logger.error('No pass template id supplied', {
        category: LOG_CATEGORY,
        requestId: inputData.requestId,
      })
      throw this.getException('BadRequest', 'Missing pass template id')
    }

    const service = await this.getClientByPassTemplateId(passTemplateId)

    const verifyRes = await service.verify(
      inputData.barcodeData,
      inputData.requestId,
    )

    if (verifyRes.ok) {
      return {
        valid: verifyRes.data.valid,
        passIdentity: verifyRes.data.passIdentity,
      }
    }
    this.logger.error('Verify license failed', {
      category: LOG_CATEGORY,
      ...verifyRes.error,
      requestId: inputData.requestId,
    })
    throw this.getException(this.getErrorTypeByCode(verifyRes.error.code), {
      message: verifyRes.error.message,
      requestId: inputData.requestId,
    })
  }
}
