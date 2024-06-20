import { Inject, Injectable } from '@nestjs/common'
import type { StatisticSourceData } from '@island.is/shared/types'
import {
  DefaultApi,
  type InlineResponse2001BodyDataLatest,
} from '../../gen/fetch'
import { DailyApiCache, HourlyApiCache } from './ultraviolet-radiation.provider'

export const LATEST_MEASUREMENT_KEY =
  'icelandicRadiationSafetyAuthority.ultravioletRadiation.latestMeasurement' as const
export const MEASUREMENT_SERIES_PAST_72_HOURS_KEY =
  'icelandicRadiationSafetyAuthority.ultravioletRadiation.measurementSeriesPast72Hours' as const
export const MEASUREMENT_SERIES_PAST_YEAR_KEY =
  'icelandicRadiationSafetyAuthority.ultravioletRadiation.measurementSeriesPastYear' as const

export const isValidMeasurement = (
  item: InlineResponse2001BodyDataLatest | undefined,
): item is Required<InlineResponse2001BodyDataLatest> => {
  return typeof item?.time === 'string' && typeof item?.uvVal === 'number'
}

@Injectable()
export class UltravioletRadiationClientService {
  constructor(
    @Inject(HourlyApiCache)
    private readonly hourlyApi: DefaultApi,
    @Inject(DailyApiCache)
    private readonly dailyApi: DefaultApi,
  ) {}

  async getLatestMeasurement(): Promise<
    StatisticSourceData<typeof LATEST_MEASUREMENT_KEY>
  > {
    const response = await this.hourlyApi.returnHourlyUV()
    const measurement = response?.body?.dataAll?.at(-1)
    if (!isValidMeasurement(measurement)) {
      return {
        data: {
          [LATEST_MEASUREMENT_KEY]: [],
        },
      }
    }
    return {
      data: {
        [LATEST_MEASUREMENT_KEY]: [
          {
            header: String(Date.parse(measurement.time)),
            value: measurement.uvVal,
          },
        ],
      },
    }
  }

  async getMeasurementSeriesPast72Hours(): Promise<
    StatisticSourceData<typeof MEASUREMENT_SERIES_PAST_72_HOURS_KEY>
  > {
    const response = await this.hourlyApi.returnHourlyUV()
    const series = response.body?.dataAll?.filter(isValidMeasurement) ?? []
    return {
      data: {
        [MEASUREMENT_SERIES_PAST_72_HOURS_KEY]: series.map((measurement) => ({
          header: String(Date.parse(measurement.time)),
          value: measurement.uvVal,
        })),
      },
    }
  }

  async getMeasurementSeriesPastYear(): Promise<
    StatisticSourceData<typeof MEASUREMENT_SERIES_PAST_YEAR_KEY>
  > {
    const response = await this.dailyApi.returnDailyUV()
    const series = response.body?.dataAll?.filter(isValidMeasurement) ?? []
    return {
      data: {
        [MEASUREMENT_SERIES_PAST_YEAR_KEY]: series.map((measurement) => ({
          header: String(Date.parse(measurement.time)),
          value: measurement.uvVal,
        })),
      },
    }
  }
}
