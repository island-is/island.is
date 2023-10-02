import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  PassVerificationData,
  Result,
  VerifyInputData,
} from '../../../licenseClient.type'
import { BaseLicenseUpdateClient } from '../../baseLicenseUpdateClient'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'

/** Category to attach each log message to */
//const LOG_CATEGORY = 'driving-license-service'

@Injectable()
export class DrivingLicenseUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    private drivingLicenseApi: DrivingLicenseApi,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  async pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  async pullUpdate(): Promise<Result<Pass>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<PassVerificationData>> {
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
      (i) => i.passInputField.identifier === 'kennitala',
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
    const nationalId = passNationalId.replace('-', '')
    const license = await this.drivingLicenseApi.getCurrentLicenseV4({
      nationalId,
    })

    if (!license) {
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
