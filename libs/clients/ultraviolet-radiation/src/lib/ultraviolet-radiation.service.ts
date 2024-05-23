import { Inject, Injectable } from '@nestjs/common'
import type { StatisticSourceData } from '@island.is/shared/types'
import {
  DefaultApi,
  type InlineResponse2001BodyDataLatest,
} from '../../gen/fetch'
import {
  DefaultApiWithLatestMeasurementCache,
  DefaultApiWithMeasurementSeriesCache,
} from './ultraviolet-radiation.provider'

export const LATEST_MEASUREMENT_KEY =
  'icelandicRadiationSafetyAuthority.ultravioletRadiation.latestMeasurement' as const
export const MEASUREMENT_SERIES_KEY =
  'icelandicRadiationSafetyAuthority.ultravioletRadiation.measurementSeries' as const

export const isValidMeasurement = (
  item: InlineResponse2001BodyDataLatest | undefined,
): item is Required<InlineResponse2001BodyDataLatest> => {
  return typeof item?.time === 'string' && typeof item?.uvVal === 'number'
}

@Injectable()
export class UltravioletRadiationClientService {
  constructor(
    @Inject(DefaultApiWithLatestMeasurementCache)
    private readonly latestMeasurementApi: DefaultApi,
    @Inject(DefaultApiWithMeasurementSeriesCache)
    private readonly measurementSeriesApi: DefaultApi,
  ) {}

  async getLatestMeasurement(): Promise<
    StatisticSourceData<typeof LATEST_MEASUREMENT_KEY>
  > {
    const response = await this.latestMeasurementApi.returnDailyUV()
    const measurement =
      response?.body?.dataLatest ?? response?.body?.dataAll?.at(-1)
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

  async getMeasurementSeries(): Promise<
    StatisticSourceData<typeof MEASUREMENT_SERIES_KEY>
  > {
    const response = await this.measurementSeriesApi.returnHourlyUV()
    const series = response.body?.dataAll?.filter(isValidMeasurement) ?? []
    return {
      data: {
        [MEASUREMENT_SERIES_KEY]: series.map((measurement) => ({
          header: String(Date.parse(measurement.time)),
          value: measurement.uvVal,
        })),
      },
    }
  }
}
