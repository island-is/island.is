import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('StatisticsOverview')
export class StatisticsOverview {
  @Field(() => Int)
  providerCount?: number

  @Field(() => ProviderStatisticInfo, { nullable: true })
  statistics?: ProviderStatisticInfo
}
