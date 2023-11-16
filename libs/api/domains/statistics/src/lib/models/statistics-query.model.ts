import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('StatisticKeyValue')
class StatisticKeyValue {
  @Field(() => String)
  key!: string

  @Field(() => Number, { nullable: true })
  value!: number | null
}

@ObjectType('StatisticsKeyValuesOnDate')
class StatisticOnDate {
  @Field(() => Date)
  date!: Date

  @Field(() => [StatisticKeyValue])
  statisticsForDate!: StatisticKeyValue[]
}

@ObjectType('StatisticsQueryResponse')
export class StatisticsQueryResponse {
  @CacheField(() => [StatisticOnDate])
  statistics!: StatisticOnDate[]
}
