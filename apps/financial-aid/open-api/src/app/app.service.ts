import formatISO from 'date-fns/formatISO'
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

  async getApplications(
    apiKey: string,
    municipalityCode: string,
    filters: FilterApplicationsDto,
  ) {
    this.logger.info(
      `trying to fetching all applications with municipalityCode ${municipalityCode}`,
      filters,
    )

    const url = new URL(
      `${this.config.backend.url}/api/financial-aid/open-api-applications/getAll`,
    )
    url.searchParams.append('startDate', filters.startDate)
    url.searchParams.append(
      'endDate',
      filters.endDate ??
        formatISO(new Date(), {
          representation: 'date',
        }),
    )
    if (filters.state) {
      url.searchParams.append('state', filters.state)
    }

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
        'Municipality-Code': municipalityCode,
      },
    }).then(async (res) => {
      return res.json()
    })
  }
}
