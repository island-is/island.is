import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticsBreakdown } from './providerStatisticsBreakdown.model'

@ObjectType(
  'DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse',
)
export class DocumentProviderDashboardProviderStatisticsBreakdownPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [DocumentProviderDashboardProviderStatisticsBreakdown])
  items!: Array<DocumentProviderDashboardProviderStatisticsBreakdown>
}
