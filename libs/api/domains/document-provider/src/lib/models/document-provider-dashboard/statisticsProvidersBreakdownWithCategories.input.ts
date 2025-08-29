import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

export enum CategoryStatisticsSortBy {
  Date = 'Date',
  Published = 'Published',
}

registerEnumType(CategoryStatisticsSortBy, { name: 'CategoryStatisticsSortBy' })

@InputType(
  'ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest',
)
export class ApiV1StatisticsNationalIdProvidersProviderIdBreakdownCategoriesGetRequest {
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
