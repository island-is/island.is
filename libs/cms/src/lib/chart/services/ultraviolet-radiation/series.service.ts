import { Injectable } from '@nestjs/common'
import { UltravioletRadiationClientService } from '@island.is/clients/ultraviolet-radiation'
import {
  ChartDataInput,
  ChartDataOutput,
  ChartDataSourceExternalJsonProviderService,
} from '../../types'
import { isValidMeasurement } from './utils'

@Injectable()
export class UltravioletRadiationSeriesService
  implements ChartDataSourceExternalJsonProviderService
{
  constructor(
    private readonly clientService: UltravioletRadiationClientService,
  ) {}

  async getChartData(_: ChartDataInput): Promise<ChartDataOutput> {
    const data = await this.clientService.getMeasurementSeries()
    // TODO: check out how the data looks
    return {
      statistics:
        data.body?.dataAll
          ?.filter(isValidMeasurement)
          .map(({ time, uvVal }) => ({
            header: time,
            headerType: 'date',
            statisticsForHeader: [
              {
                key: 'uvVal',
                value: uvVal,
              },
            ],
          })) ?? [],
    }
  }
}
