import {
  Field,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql'
import { TotalStatisticsSortBy } from './statisticsNationalIdBreakdown.input'
import { Min } from 'class-validator'

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
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number
}
