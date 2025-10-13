import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardStatistics } from './providerStatistics.model'
@ObjectType('DocumentProviderDashboardProviderStatisticsPaginationResponse')
export class DocumentProviderDashboardProviderStatisticsPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [DocumentProviderDashboardStatistics])
  items!: Array<DocumentProviderDashboardStatistics>
}
