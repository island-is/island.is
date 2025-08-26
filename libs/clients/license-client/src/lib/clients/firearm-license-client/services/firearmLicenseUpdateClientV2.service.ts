import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import { sanitize as sanitizeNationalId } from 'kennitala'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  PassVerificationData,
  Result,
} from '../../../licenseClient.type'
import { createPkPassDataInput, nationalIdIndex } from '../firearmLicenseMapper'
import { mapNationalId } from '../firearmLicenseMapper'
import type { ConfigType } from '@island.is/nest/config'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'
import { BaseLicenseUpdateClientV2 } from '../../base/licenseUpdateClientV2'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { VerifyInputDataDto } from '../../base/baseLicenseUpdateClient.types'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'

@Injectable()
export class FirearmLicenseUpdateClientV2 extends BaseLicenseUpdateClientV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    @Inject(FirearmDigitalLicenseClientConfig.KEY)
    private config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
    private openFirearmApi: OpenFirearmApi,
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
      !inputFieldValues?.some((nt) => nt.identifier === nationalIdIndex)
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
      'v2',
    )
  }

  async pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PassData>> {
    let data
    try {
      data = await Promise.all([
        this.openFirearmApi.getVerificationLicenseInfo(nationalId),
        this.openFirearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      this.logger.error(
        `Either license info- or license property info fetch failed`,
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
          message: `Either license info- or license property info fetch failed`,
        },
      }
    }

    const [licenseInfo, propertyInfo] = data
    if (!licenseInfo) {
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

    const inputValues = createPkPassDataInput(
      licenseInfo,
      propertyInfo,
      nationalId,
    )

    if (!inputValues || !licenseInfo.expirationDate) {
      const message = !(inputValues && licenseInfo.expirationDate)
        ? 'Mapping failed, input values and expirationDate missing'
        : !inputValues
        ? 'Mapping failed, missing input values'
        : 'Mapping failed, missing expirationDate'

      return {
        ok: false,
        error: {
          code: 4,
          message,
        },
      }
    }

    const thumbnail = licenseInfo.licenseImgBase64
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      expirationDate: new Date(licenseInfo?.expirationDate).toISOString(),
      passTemplateId: this.config.passTemplateId,
      thumbnail: thumbnail
        ? {
            imageBase64String: thumbnail
              .substring(thumbnail.indexOf(',') + 1)
              .trim(),
          }
        : undefined,
    }

    return this.passService.updatePkPass(payload, requestId, 'v2')
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
      'v2',
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
            message: 'Invalid input data',
          },
        }
      }
    } catch (ex) {
      return {
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      }
    }

    const { code, date } = parsedInput

    if (!code || !date) {
      return {
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      }
    }

    const verifyRes = await this.passService.verifyPkPass(
      { code, date },
      requestId,
      'v2',
    )

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      return {
        ok: true,
        data: {
          valid: false,
        },
      }
    }

    const passNationalId = verifyRes.data.pass?.inputFieldValues?.find(
      (i) => i.identifier === 'kt',
    )?.value

    if (!passNationalId) {
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing pass data',
        },
      }
    }
    const sanitizedPassNationalId = sanitizeNationalId(passNationalId)

    const licenseInfo = await this.openFirearmApi.getVerificationLicenseInfo(
      sanitizedPassNationalId,
    )

    if (!licenseInfo) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    if (!licenseInfo.ssn || !licenseInfo.name) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing nationalId or name for user',
        },
      }
    }

    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === sanitizedPassNationalId,
        passIdentity: {
          name: licenseInfo.name,
          nationalId: licenseInfo.ssn,
          picture: licenseInfo.licenseImgBase64 ?? '',
        },
      },
    }
  }
}
