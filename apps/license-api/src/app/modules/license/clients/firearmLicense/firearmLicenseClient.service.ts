import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'

@Injectable()
export class FirearmLicenseClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async revoke() {
    this.logger.debug('in revoke for firearm license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }

  async update() {
    this.logger.debug('in update for firearm license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
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
