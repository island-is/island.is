import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, LicenseUpdateUnion } from '../../license.types'
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
import { createPkPassDataInput } from './disabilityLicenseMapper'
import { z } from 'zod'
import { DisabilityLicenseUpdateData } from './disabilityLicenseClient.types'

@Injectable()
export class DisabilityLicenseClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async update(
    inputData: LicenseUpdateUnion,
  ): Promise<Result<Pass | undefined>> {
    this.logger.debug('in update for Disability license')

    let data: LicenseUpdateUnion
    try {
      data = LicenseUpdateUnion.parse(inputData)
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 4,
          message: 'Invalid payload',
        },
      }
    }

    if (data.licenseUpdateType === 'push') {
      /** PUSH - Update actual license and electronic license with provided data
       * 1. Parse and validate provided data
       * 2. Map the data to the appropriate types for updating
       * 3. Update each license with its mapped data
       */
      return {
        ok: true,
        data: undefined,
      }
    } else {
      /** PULL - Update electronic license with data pulled from the actual license
       * 1. Fetch data from TR
       * 2. Parse and validate license data
       * 3. With good data, update the electronic license with the validated license data!
       */
      return {
        ok: true,
        data: undefined,
      }
    }
    const parsedData = createPkPassDataInput(inputData)
    return await this.smartApi.upsertPkPass(parsedData as PassDataInput)
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
