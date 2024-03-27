import { Injectable } from '@nestjs/common'
import { ChartDataSourceExternalJsonProvider } from 'api-cms-domain'
import {
  UltravioletRadiationLatestMeasurementService,
  UltravioletRadiationSeriesService,
} from './services/ultraviolet-radiation'

import { ChartDataSourceExternalJsonProviderService } from './types'

@Injectable()
export class ChartService {
  private readonly services: Map<
    ChartDataSourceExternalJsonProvider,
    ChartDataSourceExternalJsonProviderService
  >

  constructor(
    uvRadiationLatestMeasurementService: UltravioletRadiationLatestMeasurementService,
    uvRadiationSeriesService: UltravioletRadiationSeriesService,
  ) {
    this.services = new Map<
      ChartDataSourceExternalJsonProvider,
      ChartDataSourceExternalJsonProviderService
    >([
      [
        ChartDataSourceExternalJsonProvider.UltravioletRadiationLatest,
        uvRadiationLatestMeasurementService,
      ],
      [
        ChartDataSourceExternalJsonProvider.UltravioletRadiationSeries,
        uvRadiationSeriesService,
      ],
    ])
  }

  async getChartData(
    input: Parameters<
      ChartDataSourceExternalJsonProviderService['getChartData']
    >[0],
  ): ReturnType<ChartDataSourceExternalJsonProviderService['getChartData']> {
    const service = this.services.get(input.externalJsonProvider)

    if (!service) {
      // TODO: handle potential error
      return {
        statistics: [],
      }
    }

    return service.getChartData(input)
  }
}
