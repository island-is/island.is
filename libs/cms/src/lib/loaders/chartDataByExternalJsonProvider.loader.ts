import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import { ChartDataSourceExternalJsonProvider } from 'api-cms-domain'
import { StatisticsQueryResponse } from '../models/chartDataSource.model'
import { ChartService } from '../chart/chart.service'
import { ChartDataInput, ChartDataOutput } from '../chart/types'

export type ChartDataByExternalJsonProviderDataLoaderType = DataLoader<
  ChartDataInput,
  ChartDataOutput
>

@Injectable()
export class ChartDataByExternalJsonProviderDataLoader
  implements
    NestDataLoader<
      ChartDataSourceExternalJsonProvider,
      StatisticsQueryResponse
    >
{
  constructor(private readonly chartService: ChartService) {}

  async loadChartData(inputs: ChartDataInput[]) {
    const promises = await Promise.all(
      inputs.map((input) => this.chartService.getChartData(input)),
    )
    return promises
  }

  // TODO: fix
  async generateDataLoader(): ChartDataByExternalJsonProviderDataLoaderType {
    return new DataLoader((inputs) => await this.loadChartData(inputs))
  }
}
