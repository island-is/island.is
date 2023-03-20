import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  DynamicBarcodeDataInput,
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { date } from 'zod'
import { GenericLicenseClient } from '../../license.types'
import { VerifyInputData } from '../../dto/verifyLicense.input'

@Injectable()
export class DisabilityLicenseClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return this.smartApi.updatePkPass(inputData, nationalId)
  }

  async pullUpdate(): Promise<Result<Pass | undefined>> {
    throw new Error('Not yet implemented')
  }

  revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return this.smartApi.revokePkPass(nationalId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    //need to parse the scanner data
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
      this.logger.debug(JSON.stringify(parsedInput))
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

    return this.smartApi.verifyPkPass({ code, date })
  }
}
