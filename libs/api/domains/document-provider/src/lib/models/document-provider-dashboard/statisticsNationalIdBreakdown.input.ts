import {
  Field,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql'
import { CategoryStatisticsSortBy } from './statisticsProvidersBreakdownWithCategories.input'

export enum TotalStatisticsSortBy {
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
  Date = 'Date',
}

registerEnumType(TotalStatisticsSortBy, { name: 'TotalStatisticsSortBy' })

@InputType('ApiV1StatisticsNationalIdBreakdownGetRequest')
export class ApiV1StatisticsNationalIdBreakdownGetRequest {
  @Field()
  nationalId!: string

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
