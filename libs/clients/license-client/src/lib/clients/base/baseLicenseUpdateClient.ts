import type { Logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import { PassVerificationData } from '../../licenseClient.type'

@Injectable()
export abstract class BaseLicenseUpdateClient {
  constructor(
    protected logger: Logger,
    protected smartApi: SmartSolutionsApi,
  ) {}

  abstract pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>>

  abstract pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>>

  abstract revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<RevokePassData>>

  abstract verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>>
}
