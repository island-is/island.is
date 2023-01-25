import { Inject, Injectable } from '@nestjs/common'
import {
  CONFIG_PROVIDER,
  LICENSE_FACTORY,
  LicenseType,
  PassTemplateIds,
} from './licenseClient.type'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { createClient } from '@island.is/feature-flags'

@Injectable()
export class LicenseClientService {
  constructor(
    @Inject(LICENSE_FACTORY)
    private licenseFactory: (
      type: LicenseType,
    ) => Promise<LicenseClient<unknown> | null>,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CONFIG_PROVIDER) private config: PassTemplateIds,
  ) {}

  async createClient(type: LicenseType) {
    const client = await this.licenseFactory(type)
    return client
  }
}
