import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import appModuleConfig from './app.config'
import { FilterApplicationsDto } from './app.dto'

@Injectable()
export class AppService {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getApplications(apiKey: string, filters: FilterApplicationsDto) {
    this.logger.info(`trying to fetching all applications`)

    return fetch(
      `${this.config.backend.url}/api/financial-aid/open-api-applications/getAll`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': apiKey,
        },
      },
    ).then(async (res) => {
      console.log('res', res)
      return res.json()
    })
  }
}
