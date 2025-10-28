import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardProviderStatisticsBreakdown')
export class DocumentProviderDashboardProviderStatisticsBreakdown {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => DocumentProviderDashboardProviderStatisticInfo, {
    nullable: true,
  })
  statistics?: DocumentProviderDashboardProviderStatisticInfo
}
