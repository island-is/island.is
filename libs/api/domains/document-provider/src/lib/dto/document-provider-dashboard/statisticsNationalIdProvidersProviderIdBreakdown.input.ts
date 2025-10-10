import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { CategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'

@InputType('GetStatisticsBreakdownByProviderId')
export class GetStatisticsBreakdownByProviderId {
  @Field()
  providerId!: string

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
