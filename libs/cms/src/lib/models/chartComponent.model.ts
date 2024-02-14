import { Field, ID, ObjectType } from '@nestjs/graphql'
import pick from 'lodash/pick'

import { SystemMetadata } from '@island.is/shared/types'

import { IChartComponent } from '../generated/contentfulTypes'

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
    interval: fields.interval ? Number(fields.interval) : undefined,
  }
}
