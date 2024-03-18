import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
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

@ObjectType('ChartStatisticKeyValue')
class StatisticKeyValue implements ChartStatisticKeyValue {
  @Field(() => String)
  key!: string

  @Field(() => Number, { nullable: true })
  value!: number | null
}

@ObjectType('ChartStatisticsForHeader')
class StatisticsForHeader implements ChartStatisticsForHeader {
  @Field(() => String)
  header!: string

  @Field(() => String)
  headerType!: string

  @CacheField(() => [StatisticKeyValue])
  statisticsForHeader!: StatisticKeyValue[]
}

@ObjectType('ChartStatisticsQueryResponse')
export class StatisticsQueryResponse implements ChartStatisticsQueryResponse {
  @CacheField(() => [StatisticsForHeader])
  statistics!: StatisticsForHeader[]
}

registerEnumType(ChartDataSourceType, { name: 'ChartDataSourceType' })
registerEnumType(ChartDataSourceExternalJsonProvider, {
  name: 'ChartDataSourceExternalJsonProvider',
})

@ObjectType()
export class ChartDataSource {
  @Field(() => ID)
  id!: string

  @CacheField(() => ChartDataSourceType)
  dataSourceType!: ChartDataSourceType

  @CacheField(() => ChartDataSourceExternalJsonProvider)
  externalJsonProvider!: ChartDataSourceExternalJsonProvider

  @CacheField(() => StatisticsQueryResponse)
  internalJson!: StatisticsQueryResponse

  @Field(() => String)
  externalCsvProviderUrl!: string
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
  return {
    id: sys.id,
    typename: 'ChartDataSource',
    ...mapChartDataSourceConfiguration(fields.configuration),
  }
}
