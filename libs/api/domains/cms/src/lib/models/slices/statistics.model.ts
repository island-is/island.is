import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Statistic, mapStatistic } from '../statistic.model'
import { IStatistics } from '../../generated/contentfulTypes'

@ObjectType()
export class Statistics {
  constructor(initializer: Statistics) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [Statistic])
  statistics: Statistic[]
}

export const mapStatistics = ({ fields, sys }: IStatistics): Statistics =>
  new Statistics({
    id: sys.id,
    title: fields.title ?? '',
    statistics: fields.statistics.map(mapStatistic),
  })
