import formatISO from 'date-fns/formatISO'
import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import appModuleConfig from './app.config'
import { FilterApplicationsDto } from './app.dto'
import { isDateValid } from './helpers'
import { ApplicationModel, PdfModel } from './models'

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
  ): Promise<ApplicationModel[]> {
    this.logger.info(
      `trying to fetching all applications with municipalityCode ${municipalityCode}`,
      filters,
    )

    const url = new URL(
      `${this.config.backend.url}/api/financial-aid/open-api-applications/getAll`,
    )
    url.searchParams.append('startDate', filters.startDate)
    isDateValid(filters.startDate, 'startDate')

    url.searchParams.append(
      'endDate',
      filters.endDate ??
        formatISO(new Date(), {
          representation: 'date',
        }),
    )
    if (filters.endDate) {
      isDateValid(filters.endDate, 'endDate')
    }
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

  async getApplication(
    apiKey: string,
    municipalityCode: string,
    id: string,
  ): Promise<PdfModel> {
    this.logger.info(
      `trying to fetching all applications with municipalityCode ${municipalityCode}`,
      id,
    )

    const url = new URL(
      `${this.config.backend.url}/api/financial-aid/open-api-applications/id/${id}`,
    )

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
