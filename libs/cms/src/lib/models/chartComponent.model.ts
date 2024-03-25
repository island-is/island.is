import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import { IChartComponent } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { ChartDataSource, mapChartDataSource } from './chartDataSource.model'

@ObjectType()
export class ChartComponent {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  type!: string

  @Field()
  sourceDataKey!: string

  @Field(() => Number, { nullable: true })
  interval?: number

  @Field(() => String, { nullable: true })
  stackId?: string

  @CacheField(() => ChartDataSource, { nullable: true })
  dataSource?: ChartDataSource | null
}

export const mapChartComponent = ({
  sys,
  fields,
}: IChartComponent): SystemMetadata<ChartComponent> => {
  return {
    id: sys.id,
    typename: 'ChartComponent',
    label: fields.label ?? '',
    type: fields.type ?? 'line',
    sourceDataKey: fields.sourceDataKey ?? '',
    stackId: fields.stackId,
    dataSource: fields.chartDataSource
      ? mapChartDataSource(fields.chartDataSource)
      : null,
    interval: fields.interval ? Number(fields.interval) : undefined,
  }
}
