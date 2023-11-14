import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

import {
  getMultipleStatistics as _getMultipleStatistics,
  getStatisticsFromSource,
} from './statistics.utils'
import { GetStatisticsQuery, StatisticSourceData } from './types'

const CACHE_ID = 'getStatistics'

@Injectable()
export class StatisticsClientService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getMultipleStatistics(query: GetStatisticsQuery) {
    let sourceData = await (this.cacheManager.get(
      CACHE_ID,
    ) as Promise<StatisticSourceData>)

    if (!sourceData) {
      sourceData = await getStatisticsFromSource()
      await this.cacheManager.set(CACHE_ID, sourceData)
    }

    const statistics = await _getMultipleStatistics(query, sourceData)

    return {
      statistics,
    }
  }
}
