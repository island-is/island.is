import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { DocumentProviderDashboardCategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'

@InputType('DocumentProviderDashboardGetStatisticsBreakdownByProviderId')
export class DocumentProviderDashboardGetStatisticsBreakdownByProviderId {
  @Field()
  providerId!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => DocumentProviderDashboardCategoryStatisticsSortBy, {
    nullable: true,
  })
  sortBy?: DocumentProviderDashboardCategoryStatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
