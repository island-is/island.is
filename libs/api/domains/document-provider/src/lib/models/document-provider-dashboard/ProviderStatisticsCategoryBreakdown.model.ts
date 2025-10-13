import { Field, Int, ObjectType } from '@nestjs/graphql'
import { DocumentProviderDashboardCategoryStatistics } from './categoryStatistics.model'

@ObjectType('DocumentProviderDashboardProviderStatisticsCategoryBreakdown')
export class DocumentProviderDashboardProviderStatisticsCategoryBreakdown {
  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Int, { nullable: true })
  month?: number

  @Field(() => [DocumentProviderDashboardCategoryStatistics], {
    nullable: true,
  })
  categoryStatistics?: Array<DocumentProviderDashboardCategoryStatistics>
}
