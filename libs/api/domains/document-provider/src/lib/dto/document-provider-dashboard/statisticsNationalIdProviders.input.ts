import {
  Field,
  Int,
  InputType,
  registerEnumType,
  GraphQLISODateTime,
} from '@nestjs/graphql'
import { IsOptional, IsBoolean, Min, Max } from 'class-validator'

export enum DocumentProviderDashboardStatisticsSortBy {
  Name = 'Name',
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
}

registerEnumType(DocumentProviderDashboardStatisticsSortBy, {
  name: 'DocumentProviderDashboardStatisticsSortBy',
})

@InputType('DocumentProviderDashboardGetStatisticsProvidersNationalId')
export class DocumentProviderDashboardGetStatisticsProvidersNationalId {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => DocumentProviderDashboardStatisticsSortBy, { nullable: true })
  sortBy?: DocumentProviderDashboardStatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  desc?: boolean

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize?: number
}
