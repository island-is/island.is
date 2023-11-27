import { Field, ID, ObjectType } from '@nestjs/graphql'
import pick from 'lodash/pick'

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
  xAxisKey?: string

  @Field({ nullable: true })
  xAxisValueType?: string
}

export const mapChart = ({ sys, fields }: IChart): SystemMetadata<Chart> => {
  return {
    id: sys.id,
    typename: 'Chart',
    ...pick(fields, [
      'title',
      'chartDescription',
      'alternativeDescription',
      'displayAsCard',
      'xAxisKey',
      'xAxisValueType',
    ]),
    startExpanded: fields.startExpanded ?? false,
    dateFrom: fields.dateFrom ?? undefined,
    dateTo: fields.dateTo ?? undefined,
    numberOfDataPoints: fields.numberOfDataPoints ?? undefined,
    components: fields.components.map(mapChartComponent),
    sourceData: fields.sourceData
      ? JSON.stringify(fields.sourceData)
      : undefined,
  }
}
