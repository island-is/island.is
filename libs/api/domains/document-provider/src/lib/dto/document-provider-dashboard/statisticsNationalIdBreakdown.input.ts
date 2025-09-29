import { Field, Int, InputType, registerEnumType, GraphQLISODateTime } from '@nestjs/graphql'
import { CategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'

export enum TotalStatisticsSortBy {
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
  Date = 'Date',
}

registerEnumType(TotalStatisticsSortBy, { name: 'TotalStatisticsSortBy' })

@InputType('GetStatisticsBreakdownByNationalId')
export class GetStatisticsBreakdownByNationalId {

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => CategoryStatisticsSortBy, { nullable: true })
  sortBy?: CategoryStatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
