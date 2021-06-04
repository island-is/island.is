import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IStatistics } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { Statistic, mapStatistic } from './statistic.model'

@ObjectType()
export class Statistics {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => [Statistic])
  statistics!: Statistic[]
}

export const mapStatistics = ({
  fields,
  sys,
}: IStatistics): SystemMetadata<Statistics> => ({
  typename: 'Statistics',
  id: sys.id,
  title: fields.title ?? '',
  statistics: (fields.statistics ?? []).map(mapStatistic),
})
