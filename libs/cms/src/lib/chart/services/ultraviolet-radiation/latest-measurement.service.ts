import { Injectable } from '@nestjs/common'
import { UltravioletRadiationClientService } from '@island.is/clients/ultraviolet-radiation'
import {
  ChartDataInput,
  ChartDataOutput,
  ChartDataSourceExternalJsonProviderService,
} from '../../types'

@Injectable()
export class UltravioletRadiationLatestMeasurementService
  implements ChartDataSourceExternalJsonProviderService
{
  constructor(
    private readonly clientService: UltravioletRadiationClientService,
  ) {}

  async getChartData(_: ChartDataInput): Promise<ChartDataOutput> {
    const data = await this.clientService.getLatestMeasurement()
    const { uvVal, time } = data.body?.dataLatest ?? {}
    if (typeof uvVal !== 'number' || !time) {
      // TODO: check what these values are
      return {
        statistics: [],
      }
    }
    return {
      statistics: [
        {
          header: time,
          headerType: 'date',
          statisticsForHeader: [
            {
              key: 'uvVal',
              value: uvVal,
            },
          ],
        },
      ],
    }
  }
}
