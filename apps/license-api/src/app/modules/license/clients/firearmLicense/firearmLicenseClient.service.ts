import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, LicenseUpdateUnion } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  Result,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'

@Injectable()
export class FirearmLicenseClientService implements GenericLicenseClient {
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
  }

  async revoke(queryId: string) {
    this.logger.debug('in revoke for Firearm license')
    return await this.smartApi.voidPkPass(queryId)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string) {
    this.logger.debug('in verify for Firearm license')

    //need to parse the scanner data
    const { code, date } = JSON.parse(inputData)

    console.log(code)

    return await this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
