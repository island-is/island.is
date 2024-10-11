import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IChart } from '../generated/contentfulTypes'
import { ChartComponent, mapChartComponent } from './chartComponent.model'

@ObjectType()
export class Chart {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  chartDescription!: string

  @Field()
  alternativeDescription!: string

  @Field()
  displayAsCard!: boolean

  @Field()
  startExpanded?: boolean

  @CacheField(() => [ChartComponent])
  components!: ChartComponent[]

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field({ nullable: true })
  numberOfDataPoints?: number

  @Field({ nullable: true })
  sourceData?: string

  @Field({ nullable: true })
  flipAxis?: boolean

  @Field({ nullable: true })
  xAxisKey?: string

  @Field({ nullable: true })
  xAxisFormat?: string

  @Field({ nullable: true })
  xAxisValueType?: string

  @Field({ nullable: true })
  customStyleConfig?: string

  @Field({ nullable: true })
  reduceAndRoundValue?: boolean

  @Field({ nullable: true })
  yAxisLabel?: string
}

export const mapChart = ({ sys, fields }: IChart): SystemMetadata<Chart> => {
  return {
    id: sys.id,
    typename: 'Chart',
    title: fields.title ?? '',
    chartDescription: fields.chartDescription ?? '',
    alternativeDescription: fields.alternativeDescription ?? '',
    displayAsCard: fields.displayAsCard ?? true,
    flipAxis: fields.flipAxis ?? false,
    xAxisKey: fields.xAxisKey ?? undefined,
    xAxisValueType: fields.xAxisValueType ?? undefined,
    xAxisFormat: fields.xAxisFormat ?? undefined,
    startExpanded: fields.startExpanded ?? false,
    dateFrom: fields.dateFrom ?? undefined,
    dateTo: fields.dateTo ?? undefined,
    numberOfDataPoints: fields.numberOfDataPoints ?? undefined,
    components: fields.components.map(mapChartComponent),
    sourceData: fields.sourceData
      ? JSON.stringify(fields.sourceData)
      : undefined,
    customStyleConfig: fields.customStyleConfig
      ? JSON.stringify(fields.customStyleConfig)
      : undefined,
    reduceAndRoundValue: fields.reduceAndRoundValue ?? true,
    yAxisLabel: fields.yAxisLabel ?? '',
  }
}
