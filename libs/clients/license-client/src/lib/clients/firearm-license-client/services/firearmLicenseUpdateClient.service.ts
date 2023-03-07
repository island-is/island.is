import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import {
  format as formatNationalId,
  sanitize as sanitizeNationalId,
} from 'kennitala'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { LicenseUpdateClient, Result } from '../../../licenseClient.type'
import { createPkPassDataInput } from '../firearmLicenseMapper'

/** Category to attach each log message to */
const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class FirearmLicenseUpdateClient implements LicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private openFirearmApi: OpenFirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  async pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    return await this.smartApi.updatePkPass(
      inputData,
      formatNationalId(nationalId),
    )
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass>> {
    let data
    try {
      data = await Promise.all([
        this.openFirearmApi.getVerificationLicenseInfo(nationalId),
        this.openFirearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'External service error',
        },
      }
    }

    const [licenseInfo, propertyInfo] = data
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

    if (!inputValues) {
      return {
        ok: false,
        error: {
          code: 4,
          message: 'Mapping failed, invalid data',
        },
      }
    }

    const thumbnail = licenseInfo.licenseImgBase64
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      thumbnail: thumbnail
        ? {
            imageBase64String: thumbnail
              .substring(thumbnail.indexOf(',') + 1)
              .trim(),
          }
        : null,
    }

    return await this.smartApi.updatePkPass(
      payload,
      formatNationalId(nationalId),
    )
  }

  async revoke(queryId: string): Promise<Result<RevokePassData>> {
    return await this.smartApi.revokePkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    //need to parse the scanner data
    const { code, date } = JSON.parse(inputData)
    const verifyRes = await this.smartApi.verifyPkPass({ code, date })

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

    if (!licenseInfo.ssn) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing ssn for user',
        },
      }
    }
    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === sanitizedPassNationalId,
      },
    }
  }
}
