import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardProviderStatisticsCategoryBreakdown } from './ProviderStatisticsCategoryBreakdown.model'
@ObjectType(
  'DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse',
)
export class DocumentProviderDashboardProviderStatisticsCategoryBreakdownPaginationResponse {
  @Field(() => Int)
  totalCount!: number

  @Field(() => [DocumentProviderDashboardProviderStatisticsCategoryBreakdown])
  items!: Array<DocumentProviderDashboardProviderStatisticsCategoryBreakdown>
}
