import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ChartDataSourceType } from 'api-cms-domain'
import { StatisticsClientService } from '@island.is/clients/statistics'
import { Loader } from '@island.is/nest/dataloader'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import {
  ChartDataByExternalJsonProviderDataLoader,
  ChartDataByExternalJsonProviderDataLoaderType,
} from '../loaders/chartDataByExternalJsonProvider.loader'
import { Chart } from '../models/chart.model'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver(() => Chart)
@CacheControl(defaultCache)
export class ChartResolver {
  constructor(private readonly externalCsvService: StatisticsClientService) {}

  @ResolveField(() => String)
  async sourceData(
    @Parent() chart: Chart,
    @Loader(ChartDataByExternalJsonProviderDataLoader)
    externalJsonService: ChartDataByExternalJsonProviderDataLoaderType,
  ): Promise<string | undefined> {
    for (const component of chart.components) {
      const dataSourceType = component.dataSource?.dataSourceType

      const input = {
        dateFrom: chart.dateFrom ? new Date(chart.dateFrom) : undefined,
        dateTo: chart.dateTo ? new Date(chart.dateTo) : undefined,
        numberOfDataPoints: chart.numberOfDataPoints,
        interval: chart.interval,
        sourceDataKeys: [component.sourceDataKey],
      }

      if (dataSourceType === ChartDataSourceType.ExternalCsv) {
        const csvUrl = component.dataSource?.externalCsvProviderUrl
        if (!csvUrl) {
          return ''
        }
        const statistics = (
          await this.externalCsvService.getMultipleStatistics(input, [csvUrl])
        ).statistics
        return !statistics?.length ? '' : JSON.stringify(statistics)
      }

      if (
        dataSourceType === ChartDataSourceType.ExternalJson &&
        component.dataSource?.externalJsonProvider
      ) {
        const statistics = (
          await externalJsonService.load({
            ...input,
            externalJsonProvider: component.dataSource.externalJsonProvider,
          })
        ).statistics
        return !statistics?.length ? '' : JSON.stringify(statistics)
      }

      return chart.sourceData
    }
  }
}
