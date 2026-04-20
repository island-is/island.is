import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardStatisticsOverview')
export class DocumentProviderDashboardStatisticsOverview {
  @Field(() => Int, { nullable: true })
  providerCount?: number

  @Field(() => DocumentProviderDashboardProviderStatisticInfo, {
    nullable: true,
  })
  statistics?: DocumentProviderDashboardProviderStatisticInfo
}
