import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardStatistics } from './providerStatistics.model'
@ObjectType('ProviderStatisticsPaginationResponse')
export class ProviderStatisticsPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [DocumentProviderDashboardStatistics])
  items!: Array<DocumentProviderDashboardStatistics>
}
