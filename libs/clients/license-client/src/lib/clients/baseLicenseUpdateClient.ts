import type { Logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { PassVerificationData, Result } from '../licenseClient.type'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsService,
} from '@island.is/clients/smart-solutions-v2'

@Injectable()
export abstract class BaseLicenseUpdateClient {
  constructor(
    protected logger: Logger,
    protected smartApi: SmartSolutionsService,
  ) {}

  abstract pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Partial<Pass> | undefined>>

  abstract pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Partial<Pass> | undefined>>

  abstract revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<RevokePassData>>

  abstract verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>>
}
