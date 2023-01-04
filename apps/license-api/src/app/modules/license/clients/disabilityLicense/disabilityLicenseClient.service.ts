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

  async delete() {
    this.logger.debug('in delete for Disability license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }

  async update() {
    this.logger.debug('in update for Disability license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }
}
