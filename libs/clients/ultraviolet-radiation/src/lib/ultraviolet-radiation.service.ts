import { Injectable } from '@nestjs/common'
import type { StatisticSourceData } from '@island.is/clients/statistics'
import {
  DefaultApi,
  type InlineResponse2001BodyDataLatest,
} from '../../gen/fetch'

export const isValidMeasurement = (
  item: InlineResponse2001BodyDataLatest | undefined,
): item is Required<InlineResponse2001BodyDataLatest> => {
  return typeof item?.time === 'string' && typeof item?.uvVal === 'number'
}

@Injectable()
export class UltravioletRadiationClientService {
  constructor(private readonly api: DefaultApi) {}

  async getLatestMeasurement(): Promise<StatisticSourceData> {
    const response = await this.api.returnDailyUV()
    const measurement = response?.body?.dataLatest
    if (!isValidMeasurement(measurement)) {
      return {
        data: { 'web.uv.latest': [] },
      }
    }
    return {
      data: {
        'web.uv.latest': [
          {
            header: measurement.time,
            value: measurement.uvVal,
          },
        ],
      },
    }
  }

  async getMeasurementSeries(): Promise<StatisticSourceData<'web.uv.series'>> {
    const response = await this.api.returnHourlyUV()
    const series = response.body?.dataAll?.filter(isValidMeasurement) ?? []
    return {
      data: {
        'web.uv.series': series.map((measurement) => ({
          header: measurement.time,
          value: measurement.uvVal,
        })),
      },
    }
  }
}
