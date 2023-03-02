import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'
import { LicenseUpdateClient, Result } from '../../licenseClient.type'

/** Category to attach each log message to */
const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export class DisabilityLicenseUpdateClient implements LicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass>> {
    return await this.smartApi.updatePkPass(inputData, nationalId)
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  async revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return await this.smartApi.revokePkPass(nationalId)
  }

  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    const { code, date } = JSON.parse(inputData)

    return await this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
