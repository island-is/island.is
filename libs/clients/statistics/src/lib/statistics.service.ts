import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache, caching } from 'cache-manager'

import type { ConfigType } from '@island.is/nest/config'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'

import {
  getMultipleStatistics as _getMultipleStatistics,
  getStatisticsFromSource,
} from './statistics.utils'
import { GetStatisticsQuery } from './types'
import { StatisticsClientConfig } from './statistics.config'
import { FetchWithCache } from './fetchConfig'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

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
        this.config?.sourceDataPaths?.split(','),
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
