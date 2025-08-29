import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql'
import { TotalStatisticsSortBy } from './statisticsNationalIdBreakdown.input'

registerEnumType(TotalStatisticsSortBy, { name: 'TotalStatisticsSortBy' })

@InputType('ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest')
export class ApiV1StatisticsNationalIdBreakdownCategoriesGetRequest {
  @Field()
  nationalId!: string

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date

  @Field(() => TotalStatisticsSortBy, { nullable: true })
  sortBy?: TotalStatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
