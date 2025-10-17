import { Field, Int, InputType, GraphQLISODateTime } from '@nestjs/graphql'
import { DocumentProviderDashboardTotalStatisticsSortBy } from './statisticsNationalIdBreakdown.input'
import { Min } from 'class-validator'

@InputType(
  'DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId',
)
export class DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => DocumentProviderDashboardTotalStatisticsSortBy, {
    nullable: true,
  })
  sortBy?: DocumentProviderDashboardTotalStatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number
}
