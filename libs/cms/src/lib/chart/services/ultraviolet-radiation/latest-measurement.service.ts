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

  async getChartData(_: ChartDataInput): ChartDataOutput {
    const data = await this.clientService.getLatestMeasurement()
    const uvValue = data.body?.dataLatest?.uvVal
    if (typeof uvValue !== 'number') {
      return {
        statistics: [],
      }
    }
    return {
      statistics: [
        {
          header: 'time', // TODO: check out how this is working today
          headerType: 'date',
          statisticsForHeader: [
            {
              key: 'uvVal',
              value: uvValue,
            },
          ],
        },
      ],
    }
  }
}
