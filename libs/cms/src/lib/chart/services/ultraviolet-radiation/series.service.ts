import { Injectable } from '@nestjs/common'
import { UltravioletRadiationClientService } from '@island.is/clients/ultraviolet-radiation'
import {
  ChartDataInput,
  ChartDataOutput,
  ChartDataSourceExternalJsonProviderService,
} from '../../types'

@Injectable()
export class UltravioletRadiationSeriesService
  implements ChartDataSourceExternalJsonProviderService
{
  constructor(
    private readonly clientService: UltravioletRadiationClientService,
  ) {}

  async getChartData(_: ChartDataInput): ChartDataOutput {
    const data = await this.clientService.getMeasurementSeries()
    // TODO: implement mapping
    return {
      statistics: [],
    }
  }
}
