import { Field, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardProviderStatisticsOverview')
export class DocumentProviderDashboardProviderStatisticsOverview {
  @Field()
  name!: string

  @Field(() => DocumentProviderDashboardProviderStatisticInfo, {
    nullable: true,
  })
  statistics?: DocumentProviderDashboardProviderStatisticInfo
}
