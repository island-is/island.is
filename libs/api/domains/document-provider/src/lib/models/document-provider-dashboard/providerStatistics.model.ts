import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardStatistics')
export class DocumentProviderDashboardStatistics {
  @Field(() => ID)
  providerId!: string

  @Field()
  name!: string

  @Field(() => ProviderStatisticInfo, { nullable: true })
  statistics?: ProviderStatisticInfo
}
