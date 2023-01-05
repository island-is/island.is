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

  async verify() {
    this.logger.debug('in verify for firearm license')
    const templates = await this.smartApi.listTemplates()
    return JSON.stringify(templates)
  }
}
