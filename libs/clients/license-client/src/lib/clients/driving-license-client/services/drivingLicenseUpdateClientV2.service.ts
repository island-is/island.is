import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'
import { Inject, Injectable } from '@nestjs/common'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  PassVerificationData,
  Result,
} from '../../../licenseClient.type'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { createPkPassDataInput, mapNationalId } from '../drivingLicenseMapper'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { BaseLicenseUpdateClientV2 } from '../../base/licenseUpdateClientV2'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { VerifyInputDataDto } from '../../base/baseLicenseUpdateClient.types'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

/** Category to attach each log message to */
const LOG_CATEGORY = 'driving-license-service'

const apiVersion = 'v2'

@Injectable()
export class DrivingLicenseUpdateClientV2 extends BaseLicenseUpdateClientV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    @Inject(DrivingDigitalLicenseClientConfig.KEY)
    private config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
    private drivingLicenseApi: DrivingLicenseApi,
    private readonly passService: PkPassService,
  ) {
    super()
  }

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassData | undefined>> {
    const inputFieldValues = inputData.inputFieldValues ?? []
    //small check that nationalId doesnt' already exist
    if (
      inputFieldValues &&
      !inputFieldValues?.some((nt) => nt.identifier === 'kennitala')
    ) {
      inputFieldValues.push(mapNationalId(nationalId))
    }
    return this.passService.updatePkPass(
      {
        ...inputData,
        inputFieldValues,
        passTemplateId: this.config.passTemplateId,
      },
      requestId,
      apiVersion,
    )
  }

  async pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassData | undefined>> {
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

    // v4 and v5 DriverLicenseDto are structurally identical but ts-node
    // treats them as incompatible due to different import paths
    const inputValues = createPkPassDataInput(licenseInfo as any, remarks)

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

    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: licenseInfo.dateValidTo.toISOString(),
      passTemplateId: this.config.passTemplateId,
      thumbnail: image
        ? {
            imageBase64String: image.substring(image.indexOf(',') + 1).trim(),
          }
        : undefined,
    }

    return this.passService.updatePkPass(payload, requestId, apiVersion)
  }

  revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassRevocationData>> {
    const passTemplateId = this.config.passTemplateId
    const payload: PassDataInput = {
      inputFieldValues: [mapNationalId(nationalId)],
    }
    return this.passService.revokePkPass(
      passTemplateId,
      payload,
      requestId,
      apiVersion,
    )
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>> {
    //need to parse the scanner data
    let parsedInput: VerifyInputDataDto
    try {
      parsedInput = plainToInstance(VerifyInputDataDto, JSON.parse(inputData))
      const errors = await validate(parsedInput)
      if (errors.length > 0) {
        return {
          ok: false,
          error: {
            code: 12,
            message:
              'Pkpass verification data input mapping failed, data may be invalid',
          },
        }
      }
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

    const verifyRes = await this.passService.verifyPkPass(
      { code, date },
      requestId,
      apiVersion,
    )

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      this.logger.debug('PkPass is invalid', {
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

    const passNationalId = verifyRes.data.pass?.inputFieldValues?.find(
      (i) => i.identifier === 'kennitala',
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
    const name = license?.name ?? ''
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
