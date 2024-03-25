import { Injectable } from '@nestjs/common'
import { UltravioletRadiationClientService } from '@island.is/clients/ultraviolet-radiation'
import {
  ChartDataInput,
  ChartDataOutput,
  ChartDataSourceExternalJsonProviderService,
} from '../../types'
import { isValidMeasurement } from './utils'

@Injectable()
export class UltravioletRadiationLatestMeasurementService
  implements ChartDataSourceExternalJsonProviderService
{
  constructor(
    private readonly clientService: UltravioletRadiationClientService,
  ) {}

  async getChartData(_: ChartDataInput): Promise<ChartDataOutput> {
    const data = await this.clientService.getLatestMeasurement()
    const measurement = data.body?.dataLatest ?? {}
    if (!isValidMeasurement(measurement)) {
      // TODO: check what these values are
      return {
        statistics: [],
      }
    }
    return {
      statistics: [
        {
          header: measurement.time,
          headerType: 'date',
          statisticsForHeader: [
            {
              key: 'uvVal',
              value: measurement.uvVal,
            },
          ],
        },
      ],
    }
  }
}
