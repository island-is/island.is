import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'
import type { EnhancedFetchAPI } from '@island.is/clients/middlewares'
import type { StatisticSourceData } from '@island.is/shared/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
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
    private directorateOfEqualityService: DirectorateOfEqualityClientService,
  ) {}

  /**
   * The DOE aggregate-statistics endpoint returns all of its series in one
   * call (no per-key filtering), so it's fetched alongside the CSV source
   * on every request. Isolated in its own try/catch so a DOE outage can't
   * break charts that don't use it.
   */
  private async getDirectorateOfEqualityStatistics(): Promise<StatisticSourceData> {
    try {
      const { series } =
        await this.directorateOfEqualityService.getAggregateStatistics()
      return {
        data: Object.fromEntries(series.map((s) => [s.key, s.points])),
      }
    } catch (error) {
      this.logger.error(error)
      return { data: {} }
    }
  }

  async getMultipleStatistics(query: GetStatisticsQuery) {
    try {
      const promises = [
        getStatisticsFromCsvUrls(
          this.fetch,
          this.config?.sourceDataPaths?.split(','),
        ),
        this.getDirectorateOfEqualityStatistics(),
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

      const [csvSourceData, doeSourceData, ...rest] = await Promise.all(
        promises,
      )

      const statistics = await _getMultipleStatistics(query, {
        data: {
          ...csvSourceData.data,
          ...doeSourceData.data,
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
