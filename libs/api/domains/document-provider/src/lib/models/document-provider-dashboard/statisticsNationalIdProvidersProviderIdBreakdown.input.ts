import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql'
import { CategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'

@InputType('ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest')
export class ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest {
  @Field()
  nationalId!: string

  @Field()
  providerId!: string

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
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
