import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
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
  verify(inputData: string): Promise<Result<VerifyPassData>> {
    const { code, date } = JSON.parse(inputData)

    return this.smartApi.verifyPkPass({ code, date })
  }
}
