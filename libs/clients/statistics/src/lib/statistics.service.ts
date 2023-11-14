import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import {
  getMultipleStatistics as _getMultipleStatistics,
  getStatisticsFromSource,
} from './statistics.utils'
import { GetStatisticsQuery, StatisticSourceData } from './types'
import { StatisticsClientConfig } from './statistics.config'
import { ConfigType } from '@island.is/nest/config'

const CACHE_ID = 'getStatistics'

@Injectable()
export class StatisticsClientService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(StatisticsClientConfig.KEY)
    private config: ConfigType<typeof StatisticsClientConfig>,
  ) {}

  async getMultipleStatistics(query: GetStatisticsQuery) {
    let sourceData = await (this.cacheManager.get(
      CACHE_ID,
    ) as Promise<StatisticSourceData>)

    if (!sourceData) {
      sourceData = await getStatisticsFromSource(
        this.config?.sourceDataPaths?.split(','),
      )
      await this.cacheManager.set(CACHE_ID, sourceData)
    }

    const statistics = await _getMultipleStatistics(query, sourceData)

    return {
      statistics,
    }
  }
}
