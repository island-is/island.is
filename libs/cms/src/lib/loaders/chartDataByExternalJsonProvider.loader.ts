import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { ChartService } from '../chart/chart.service'
import { ChartDataInput, ChartDataOutput } from '../chart/types'

export type ChartDataByExternalJsonProviderDataLoaderType = DataLoader<
  ChartDataInput,
  ChartDataOutput
>

@Injectable()
export class ChartDataByExternalJsonProviderDataLoader
  implements NestDataLoader<ChartDataInput, ChartDataOutput>
{
  constructor(private readonly chartService: ChartService) {}

  async loadChartData(
    inputs: readonly ChartDataInput[],
  ): Promise<ChartDataOutput[]> {
    return Promise.all(
      inputs.map((input) => this.chartService.getChartData(input)),
    )
  }

  generateDataLoader(): ChartDataByExternalJsonProviderDataLoaderType {
    return new DataLoader((inputs) => this.loadChartData(inputs))
  }
}
