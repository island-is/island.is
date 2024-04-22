import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'

import {
  getMultipleStatistics as _getMultipleStatistics,
  getStatisticsFromSource,
} from './statistics.utils'
import { GetStatisticsQuery } from './types'
import { StatisticsClientConfig } from './statistics.config'
import { FetchWithCache } from './fetchConfig'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class StatisticsClientService {
  constructor(
    @Inject(StatisticsClientConfig.KEY)
    private config: ConfigType<typeof StatisticsClientConfig>,
    @Inject(FetchWithCache)
    private fetch: EnhancedFetchAPI,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getMultipleStatistics(query: GetStatisticsQuery) {
    try {
      const sourceData = await getStatisticsFromSource(
        this.fetch,
        this.config?.sourceDataPaths
          ?.concat(
            ',https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=69103634&format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=88483785&format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=1784161095&format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=1328499480&format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=988483708&format=csv,https://docs.google.com/spreadsheets/d/16lDDimj8cU2hWWvM87GiXDN9AO0Qvpq-R0LXbaFFwtQ/export?gid=940184562&format=csv',
          )
          .split(','),
      )

      const statistics = await _getMultipleStatistics(query, sourceData)

      return {
        statistics,
      }
    } catch (e) {
      this.logger.error(e)
      throw new Error('Could not get multiple statistics')
    }
  }
}
