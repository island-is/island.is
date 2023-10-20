import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, VerifyLicenseResult } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  RevokePassData,
  Result,
  SmartSolutionsApi,
  PassDataInput,
} from '@island.is/clients/smartsolutions'
import { VerifyInputData } from '../../dto/verifyLicense.input'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { createPkPassDataInput, mapNationalId } from './drivingLicenseMapper'
import { LOG_CATEGORY } from './drivingLicenseApiClient.type'
import { DrivingLicenseApiClientConfig } from './drivingLicenseApiClient.config'
import type { ConfigType } from '@island.is/nest/config'

@Injectable()
export class DrivingLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(DrivingLicenseApiClientConfig.KEY)
    private config: ConfigType<typeof DrivingLicenseApiClientConfig>,
    private drivingLicenseApi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    const inputFieldValues = inputData.inputFieldValues ?? []
    //small check that nationalId doesnt' already exist
    if (
      inputFieldValues &&
      !inputFieldValues?.some((nt) => nt.identifier === 'kennitala')
    ) {
      inputFieldValues.push(mapNationalId(nationalId))
    }
    return this.smartApi.updatePkPass(
      {
        ...inputData,
        inputFieldValues,
        passTemplateId: this.config.passTemplateId,
      },
      requestId,
    )
  }

  async pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    let data
    try {
      data = await Promise.all([
        this.drivingLicenseApi.getCurrentLicenseV4({ nationalId }),
        this.drivingLicenseApi.getRemarksCodeTable(),
      ])
    } catch (e) {
      this.logger.error(
        'Current driving license fetch and/or remarks fetch failed',
        {
          error: e,
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return {
        ok: false,
        error: {
          code: 13,
          message: `Either current driving license fetch or remarks fetch failed`,
          data: JSON.stringify(e),
        },
      }
    }

    const [licenseInfo, remarks] = data

    if (!licenseInfo) {
      this.logger.warn('No license info found for user, exiting update', {
        requestId,
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    const inputValues = createPkPassDataInput(licenseInfo, remarks)

    if (!inputValues || !licenseInfo.dateValidTo) {
      this.logger.error(
        'pkpass data input mapping failed, data may be invalid',
        {
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return {
        ok: false,
        error: {
          code: 4,
          message: 'pkpass data input mapping failed, data may be invalid',
        },
      }
    }

    const image = licenseInfo.photo?.image
    const thumbnail = image
      ? {
          imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
        }
      : null

    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: licenseInfo.dateValidTo.toISOString(),
      passTemplateId: this.config.passTemplateId,
      thumbnail,
    }

    return this.smartApi.updatePkPass(payload, requestId)
  }

  revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<RevokePassData>> {
    const passTemplateId = this.config.passTemplateId
    const payload: PassDataInput = {
      inputFieldValues: [mapNationalId(nationalId)],
    }
    return this.smartApi.revokePkPass(passTemplateId, payload, requestId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<VerifyLicenseResult>> {
    //need to parse the scanner data
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      this.logger.error(
        'Pkpass verification data input mapping failed, data may be invalid',
        {
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return {
        ok: false,
        error: {
          code: 12,
          message:
            'Pkpass verification data input mapping failed, data may be invalid',
        },
      }
    }

    const { code, date } = parsedInput

    if (!code || !date) {
      this.logger.error(
        'Invalid verification input data, either code or date are missing or invalid ',
        {
          requestId,
          category: LOG_CATEGORY,
        },
      )
      return {
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid verification input data, either code or date are missing or invalid',
        },
      }
    }

    const verifyRes = await this.smartApi.verifyPkPass(
      { code, date },
      requestId,
    )

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      this.logger.debug('PkPass is valid', {
        requestId,
        category: LOG_CATEGORY,
      })
      return {
        ok: true,
        data: {
          valid: false,
        },
      }
    }

    const passNationalId = verifyRes.data.pass?.inputFieldValues.find(
      (i) => i.passInputField.identifier === 'kennitala',
    )?.value

    if (!passNationalId) {
      this.logger.error('Missing unique identifier in pkpass input', {
        requestId,
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing unique identifier in pkpass input',
        },
      }
    }
    const nationalId = passNationalId.replace('-', '')
    const license = await this.drivingLicenseApi.getCurrentLicenseV4({
      nationalId,
    })

    if (!license) {
      this.logger.warn('No license info found for user', {
        requestId,
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    const licenseNationalId = license.socialSecurityNumber
    const name = license.name ?? ''
    const picture = license.photo?.image ?? ''

    if (!licenseNationalId || !name || !picture) {
      this.logger.error('Missing data. NationalId, name or photo missing', {
        requestId,
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing data. NationalId, name or photo missing',
        },
      }
    }

    return {
      ok: true,
      data: {
        valid: licenseNationalId === nationalId,
        passIdentity: {
          nationalId: licenseNationalId,
          name,
          picture,
        },
      },
    }
  }
}
