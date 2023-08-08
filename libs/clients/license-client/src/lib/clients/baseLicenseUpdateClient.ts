import type { Logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { PassVerificationData, Result } from '../licenseClient.type'

/** Category to attach each log message to */
//const LOG_CATEGORY = 'disability-license-service'

@Injectable()
export abstract class BaseLicenseUpdateClient {
  constructor(
    protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {}

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return this.smartApi.updatePkPass(inputData, nationalId)
  }

  abstract pullUpdate(nationalId: string): Promise<Result<Pass | undefined>>

  revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return this.smartApi.revokePkPass(nationalId)
  }

  abstract verify(inputData: string): Promise<Result<PassVerificationData>>
}
