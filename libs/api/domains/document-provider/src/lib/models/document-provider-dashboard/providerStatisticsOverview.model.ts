import { Field, ObjectType } from '@nestjs/graphql'
import { ProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardStatisticsOverview')
export class DocumentProviderDashboardStatisticsOverview {
  @Field()
  name!: string

  @Field(() => ProviderStatisticInfo, { nullable: true })
  statistics?: ProviderStatisticInfo
}
