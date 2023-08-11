import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, VerifyLicenseResult } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  RevokePassData,
  Result,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { VerifyInputData } from '../../dto/verifyLicense.input'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'

@Injectable()
export class DrivingLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private drivingLicenseAPi: DrivingLicenseApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  async pullUpdate(): Promise<Result<Pass | undefined>> {
    throw new Error('Not yet implemented')
  }
  async pushUpdate(): Promise<Result<Pass | undefined>> {
    throw new Error('Not yet implemented')
  }
  revoke(): Promise<Result<RevokePassData>> {
    throw new Error('Not yet implemented')
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyLicenseResult>> {
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
    const license = await this.drivingLicenseAPi.getCurrentLicenseV4({
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
