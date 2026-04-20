import {
  Field,
  Int,
  InputType,
  registerEnumType,
  GraphQLISODateTime,
} from '@nestjs/graphql'
import { DocumentProviderDashboardCategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'
import { Min } from 'class-validator'

export enum DocumentProviderDashboardTotalStatisticsSortBy {
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
  Date = 'Date',
}

registerEnumType(DocumentProviderDashboardTotalStatisticsSortBy, {
  name: 'DocumentProviderDashboardTotalStatisticsSortBy',
})

@InputType('DocumentProviderDashboardGetStatisticsBreakdownByNationalId')
export class DocumentProviderDashboardGetStatisticsBreakdownByNationalId {
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
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number
}
