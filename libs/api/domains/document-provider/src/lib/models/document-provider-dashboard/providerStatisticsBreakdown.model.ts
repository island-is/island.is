import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('ProviderStatisticsBreakdown')
export class ProviderStatisticsBreakdown {
  @Field(() => Int)
  year?: number

  @Field(() => Int)
  month?: number

  @Field(() => ProviderStatisticInfo, { nullable: true })
  statistics?: ProviderStatisticInfo
}
