import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import flatten from 'lodash/flatten'
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

// TODO: create ChartNumberBox field resolver

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
    const responses = await Promise.all(
      chart.components.map((component) => {
        return (async () => {
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
              return []
            }
            return (
              await this.externalCsvService.getMultipleStatistics(input, [
                csvUrl,
              ])
            ).statistics
          }

          if (
            dataSourceType === ChartDataSourceType.ExternalJson &&
            component.dataSource?.externalJsonProvider
          ) {
            return (
              await externalJsonService.load({
                ...input,
                externalJsonProvider: component.dataSource.externalJsonProvider,
              })
            ).statistics
          }

          return component.dataSource?.internalJson?.statistics ?? []
        })()
      }),
    )
    const sourceData = flatten(
      responses.filter((item) => Array.isArray(item) && item.length > 0),
    )

    return sourceData.length > 0 ? JSON.stringify(sourceData) : ''
  }
}
