import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  InputType,
  registerEnumType,
} from '@nestjs/graphql'

export enum StatisticsSortBy {
  Name = 'Name',
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
}

registerEnumType(StatisticsSortBy, { name: 'StatisticsSortBy' })

@InputType('ApiV1StatisticsNationalIdProvidersGetRequest')
export class ApiV1StatisticsNationalIdProvidersGetRequest {
  @Field()
  nationalId!: string

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date

  @Field(() => StatisticsSortBy, { nullable: true })
  sortBy?: StatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
