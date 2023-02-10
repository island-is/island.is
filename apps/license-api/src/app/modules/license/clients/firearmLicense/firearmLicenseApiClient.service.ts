import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  SmartSolutionsApi,
  PassDataInput,
  Pass,
  RevokePassData,
  VerifyPassData,
  Result,
} from '@island.is/clients/smartsolutions'
import { createPkPassDataInput, formatNationalId } from './firearmLicenseMapper'
import { format } from 'kennitala'

@Injectable()
export class FirearmLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: OpenFirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  async pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return await this.smartApi.updatePkPass(
      inputData,
      formatNationalId(nationalId),
    )
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass | undefined>> {
    let data
    try {
      data = await Promise.all([
        this.firearmApi.getVerificationLicenseInfo(nationalId),
        this.firearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
          data: JSON.stringify(e),
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

    return await this.smartApi.updatePkPass(payload, format(nationalId))
  }

  async revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return await this.smartApi.revokePkPass(formatNationalId(nationalId))
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(
    inputData: string,
    nationalId: string,
  ): Promise<Result<VerifyPassData>> {
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

    const licenseInfo = await this.firearmApi.getVerificationLicenseInfo(
      nationalId,
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
        valid: format(licenseInfo.ssn) === passNationalId,
      },
    }
  }
}
