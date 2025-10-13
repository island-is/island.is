import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { DocumentProviderDashboardCategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'
import { IsUUID, IsOptional, IsBoolean, Min, Max } from 'class-validator'

@InputType('DocumentProviderDashboardGetStatisticsBreakdownByProviderId')
export class DocumentProviderDashboardGetStatisticsBreakdownByProviderId {
  @Field()
  @IsUUID('4', { message: 'providerId must be a UUID v4' })
  providerId!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => DocumentProviderDashboardCategoryStatisticsSortBy, {
    nullable: true,
  })
  sortBy?: DocumentProviderDashboardCategoryStatisticsSortBy

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  desc?: boolean

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize?: number
}
