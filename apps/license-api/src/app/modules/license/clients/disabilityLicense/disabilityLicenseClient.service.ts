import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  PassDataInput,
  Result,
  SmartSolutionsApi,
  VerifyPassData,
  VoidPassData,
} from '@island.is/clients/smartsolutions'

@Injectable()
export class DisabilityLicenseClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async update(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return await this.smartApi.updatePkPass(inputData, nationalId)
  }

  async revoke(queryId: string): Promise<Result<VoidPassData>> {
    this.logger.debug('in revoke for Disability license')
    return await this.smartApi.voidPkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    this.logger.debug('in verify for Firearm license')
    const { code, date } = JSON.parse(inputData)

    return await this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
