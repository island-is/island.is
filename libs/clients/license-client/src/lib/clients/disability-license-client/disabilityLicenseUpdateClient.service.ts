import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { Result } from '../../licenseClient.type'
import { BaseLicenseUpdateClient } from '../baseLicenseUpdateClient'

/** Category to attach each log message to */
const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export class DisabilityLicenseUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    return this.smartApi.updatePkPass(inputData, nationalId)
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

  verify(inputData: string): Promise<Result<VerifyPassData>> {
    const { code, date } = JSON.parse(inputData)

    return this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
