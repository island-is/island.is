import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, VerifyLicenseResult } from '../../license.types'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  SmartSolutionsApi,
  PassDataInput,
  Pass,
  RevokePassData,
  Result,
} from '@island.is/clients/smartsolutions'
import { createPkPassDataInput, mapNationalId } from './firearmLicenseMapper'
import { sanitize as sanitizeNationalId } from 'kennitala'
import { VerifyInputData } from '../../dto/verifyLicense.input'
import type { ConfigType } from '@island.is/nest/config'
import { FirearmLicenseApiClientConfig } from './firearmLicenseApiClient.config'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'

@Injectable()
export class FirearmLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(FirearmLicenseApiClientConfig.KEY)
    private config: ConfigType<typeof FirearmLicenseApiClientConfig>,
    private firearmApi: OpenFirearmApi,
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
      !inputFieldValues?.some((nt) => nt.identifier === 'kt')
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
  ): Promise<Result<Pass>> {
    let data
    try {
      data = await Promise.all([
        this.firearmApi.getVerificationLicenseInfo(nationalId),
        this.firearmApi.getVerificationPropertyInfo(nationalId),
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
    this.logger.warn('No license info found for user', {
      requestId,
      category: LOG_CATEGORY,
    })
    if (!licenseInfo) {
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
        : null,
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

    const verifyRes = await this.smartApi.verifyPkPass(
      { code, date },
      requestId,
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

    const passNationalId = verifyRes.data.pass?.inputFieldValues.find(
      (i) => i.passInputField.identifier === 'kt',
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

    const licenseInfo = await this.firearmApi.getVerificationLicenseInfo(
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
