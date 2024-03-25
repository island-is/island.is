import { Injectable } from '@nestjs/common'
import { UltravioletRadiationClientService } from '@island.is/clients/ultraviolet-radiation'
import {
  ChartDataInput,
  ChartDataOutput,
  ChartDataSourceExternalJsonProviderService,
} from '../../types'
import { isValidMeasurement } from './utils'
import { getMultipleStatistics } from '@island.is/clients/statistics'

@Injectable()
export class UltravioletRadiationSeriesService
  implements ChartDataSourceExternalJsonProviderService
{
  constructor(
    private readonly clientService: UltravioletRadiationClientService,
  ) {}

  async getChartData(input: ChartDataInput): Promise<ChartDataOutput> {
    const data = await this.clientService.getMeasurementSeries()

    const statistics =
      data.body?.dataAll?.filter(isValidMeasurement).map(({ time, uvVal }) => ({
        uvVal, // TODO: perhaps add this automatically in the chart.service.ts file
        header: String(Date.parse(time)),
        headerType: 'date',
        statisticsForHeader: [
          {
            key: 'uvVal',
            value: uvVal,
          },
        ],
      })) ?? []

    const filteredStatistics = await getMultipleStatistics(
      { ...input, sourceDataKeys: ['uvVal'] },
      {
        data: {
          uvVal: statistics.map((stat) => ({
            header: stat.header,
            value: stat.uvVal,
          })),
        },
      },
    )

    // TODO: combine this logic, it's also here apps/web/components/Charts/v2/hooks/data.ts
    return {
      statistics: filteredStatistics.map((stat) => ({
        ...stat,
        ...stat.statisticsForHeader.reduce((prev, curr) => {
          if (curr.value !== undefined) {
            prev[curr.key] = curr.value
          }
          return prev
        }, {} as Record<string, string | number | null>),
      })),
    }
  }
}
