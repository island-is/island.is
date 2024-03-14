import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import {
  ChartDataSourceConfiguration,
  ChartDataSourceExternalJsonProvider,
  ChartDataSourceType,
  ChartStatisticKeyValue,
  ChartStatisticsForHeader,
  ChartStatisticsQueryResponse,
  SystemMetadata,
} from 'api-cms-domain'
import { IChartDataSource } from '../generated/contentfulTypes'

@ObjectType('StatisticKeyValue')
class StatisticKeyValue implements ChartStatisticKeyValue {
  @Field(() => String)
  key!: string

  @Field(() => Number, { nullable: true })
  value!: number | null
}

@ObjectType('StatisticsForHeader')
class StatisticsForHeader implements ChartStatisticsForHeader {
  @Field(() => String)
  header!: string

  @Field(() => String)
  headerType!: string

  @Field(() => [StatisticKeyValue])
  statisticsForHeader!: StatisticKeyValue[]
}

@ObjectType('StatisticsQueryResponse')
export class StatisticsQueryResponse implements ChartStatisticsQueryResponse {
  @CacheField(() => [StatisticsForHeader])
  statistics!: StatisticsForHeader[]
}

@ObjectType()
export class ChartDataSource {
  @Field(() => ID)
  id!: string

  @CacheField(() => StatisticsQueryResponse)
  sourceData!: ChartDataSourceConfiguration
}

const mapChartDataSourceConfiguration = (
  configuration?: Partial<ChartDataSourceConfiguration>,
): ChartDataSourceConfiguration => {
  let dataSourceType = ChartDataSourceType.InternalJson

  if (
    configuration?.dataSourceType &&
    Object.values(ChartDataSource).includes(configuration.dataSourceType)
  ) {
    dataSourceType = configuration.dataSourceType
  }

  let externalJsonProvider =
    ChartDataSourceExternalJsonProvider.UltravioletRadiationLatest

  if (
    configuration?.externalJsonProvider &&
    Object.values(ChartDataSourceExternalJsonProvider).includes(
      configuration.externalJsonProvider,
    )
  ) {
    externalJsonProvider = configuration.externalJsonProvider
  }

  return {
    dataSourceType,
    externalJsonProvider,
    internalJson: configuration?.internalJson ?? { statistics: [] },
    externalCsvProviderUrl: configuration?.externalCsvProviderUrl ?? '',
  }
}

export const mapChartDataSource = ({
  sys,
  fields,
}: IChartDataSource): SystemMetadata<ChartDataSource> => {
  const configuration = mapChartDataSourceConfiguration(fields.configuration)
  return {
    id: sys.id,
    typename: 'ChartDataSource',
    sourceData: configuration, // This field will be resolved at request time
  }
}
