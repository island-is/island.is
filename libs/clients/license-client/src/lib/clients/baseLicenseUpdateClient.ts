import type { Logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { PassVerificationData, Result } from '../licenseClient.type'

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

  abstract revoke(nationalId: string): Promise<Result<RevokePassData>>

  abstract verify(inputData: string): Promise<Result<PassVerificationData>>
}
