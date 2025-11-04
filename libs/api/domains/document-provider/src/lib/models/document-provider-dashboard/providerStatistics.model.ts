import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticInfo } from './providerStatisticInfo.model'

@ObjectType('DocumentProviderDashboardStatistics')
export class DocumentProviderDashboardStatistics {
  @Field(() => ID)
  providerId!: string

  @Field()
  name!: string

  @Field(() => DocumentProviderDashboardProviderStatisticInfo, {
    nullable: true,
  })
  statistics?: DocumentProviderDashboardProviderStatisticInfo
}
