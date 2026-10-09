import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IChartNumberBoxGroup } from '../generated/contentfulTypes'
import { ChartNumberBox, mapChartNumberBox } from './chartNumberBox.model'

@ObjectType()
export class ChartNumberBoxGroup {
  @Field(() => ID)
  id!: string

  @CacheField(() => [ChartNumberBox])
  components!: ChartNumberBox[]

  @Field(() => Int, { nullable: true })
  columnCount?: number
}

export const mapChartNumberBoxGroup = ({
  sys,
  fields,
}: IChartNumberBoxGroup): SystemMetadata<ChartNumberBoxGroup> => ({
  id: sys.id,
  typename: 'ChartNumberBoxGroup',
  components: (fields.components ?? []).map(mapChartNumberBox),
  columnCount: fields.columnCount ?? undefined,
})
