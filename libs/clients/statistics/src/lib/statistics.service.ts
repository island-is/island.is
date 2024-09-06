import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  LATEST_MEASUREMENT_KEY as LATEST_UV_MEASUREMENT_KEY,
  MEASUREMENT_SERIES_PAST_72_HOURS_KEY as UV_MEASUREMENT_SERIES_PAST_72_HOURS_KEY,
  MEASUREMENT_SERIES_PAST_YEAR_KEY as UV_MEASUREMENT_SERIES_PAST_YEAR_KEY,
  UltravioletRadiationClientService,
} from '@island.is/clients/ultraviolet-radiation'

import {
  getMultipleStatistics as _getMultipleStatistics,
  getStatisticsFromCsvUrls,
} from './statistics.utils'
import { GetStatisticsQuery } from './types'
import { StatisticsClientConfig } from './statistics.config'
import { FetchWithCache } from './fetchConfig'

@Injectable()
export class StatisticsClientService {
  constructor(
    @Inject(StatisticsClientConfig.KEY)
    private config: ConfigType<typeof StatisticsClientConfig>,
    @Inject(FetchWithCache)
    private fetch: EnhancedFetchAPI,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private ultravioletRadiationService: UltravioletRadiationClientService,
  ) {}

  async getMultipleStatistics(query: GetStatisticsQuery) {
    try {
      const promises = [
        getStatisticsFromCsvUrls(
          this.fetch,
          this.config?.sourceDataPaths?.split(','),
        ),
      ]

      if (query.sourceDataKeys.includes(LATEST_UV_MEASUREMENT_KEY)) {
        promises.push(this.ultravioletRadiationService.getLatestMeasurement())
      }
      if (
        query.sourceDataKeys.includes(UV_MEASUREMENT_SERIES_PAST_72_HOURS_KEY)
      ) {
        promises.push(
          this.ultravioletRadiationService.getMeasurementSeriesPast72Hours(),
        )
      }
      if (query.sourceDataKeys.includes(UV_MEASUREMENT_SERIES_PAST_YEAR_KEY)) {
        promises.push(
          this.ultravioletRadiationService.getMeasurementSeriesPastYear(),
        )
      }

      const [csvSourceData, ...rest] = await Promise.all(promises)

      const statistics = await _getMultipleStatistics(query, {
        data: {
          ...csvSourceData.data,
          ...rest.reduce((acc, item) => ({ ...acc, ...item.data }), {}),
        },
      })

      return {
        statistics,
      }
    } catch (e) {
      this.logger.error(e)
      throw new Error('Could not get multiple statistics')
    }
  }
}
