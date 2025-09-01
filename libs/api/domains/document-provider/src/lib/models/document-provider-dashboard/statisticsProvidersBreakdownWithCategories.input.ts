import {
  Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import { Min } from 'class-validator'

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
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number
}
