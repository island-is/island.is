import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import { FirearmApi } from '@island.is/clients/firearm-license'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'

@Injectable()
export class FirearmLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: FirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  async update(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return await this.smartApi.updatePkPass(inputData, nationalId)
  }

  async revoke(queryId: string): Promise<Result<RevokePassData>> {
    this.logger.debug('in revoke for Disability license')
    return await this.smartApi.revokePkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(
    inputData: string,
    nationalId: string,
  ): Promise<Result<VerifyPassData>> {
    this.logger.debug('in verify for Firearm license')

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

    //TODO: Verify license when endpoints are ready
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

    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === passNationalId,
      },
    }
  }
}
