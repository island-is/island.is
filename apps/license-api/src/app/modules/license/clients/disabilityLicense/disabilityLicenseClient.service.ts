import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'

@Injectable()
export class DisabilityLicenseClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private smartApi: SmartSolutionsApi,
  ) {}

  async revoke() {
    this.logger.debug('in delete for Disability license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }

  async update() {
    this.logger.debug('in update for Disability license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string) {
    this.logger.debug('in verify for Firearm license')
    const { code, date } = JSON.parse(inputData)

    return await this.smartApi.verifyPkPass({ code, date })

    //TODO: Verify license when endpoints are ready
    //const verifyLicenseResult = await this.service.verify(nationalId?)
    //return JSON.stringify(templates)
  }
}
