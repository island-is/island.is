import type { Logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { PassVerificationData, Result } from '../licenseClient.type'
import {
  PassDataInput,
  PkPass,
  RevokePassData,
  SmartSolutionsService,
} from '@island.is/clients/smart-solutions'

@Injectable()
export abstract class BaseLicenseUpdateClient {
  constructor(
    protected logger: Logger,
    protected smartService: SmartSolutionsService,
  ) {}

  abstract pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PkPass>>

  abstract pullUpdate(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<PkPass>>

  abstract revoke(
    nationalId: string,
    requestId?: string,
  ): Promise<Result<RevokePassData>>

  abstract verify(
    inputData: string,
    requestId?: string,
  ): Promise<Result<PassVerificationData>>
}
