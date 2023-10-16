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
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    return this.smartApi.updatePkPass(inputData, nationalId, requestId)
  }

  abstract pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>>

  revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return this.smartApi.revokePkPass(nationalId)
  }

  abstract verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>>
}
