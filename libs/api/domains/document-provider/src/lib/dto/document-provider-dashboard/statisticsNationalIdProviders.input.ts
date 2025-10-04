import {
  Field,
  Int,
  InputType,
  registerEnumType,
  GraphQLISODateTime,
} from '@nestjs/graphql'
import { Min } from 'class-validator'

export enum StatisticsSortBy {
  Name = 'Name',
  Published = 'Published',
  Opened = 'Opened',
  Failures = 'Failures',
}

registerEnumType(StatisticsSortBy, { name: 'StatisticsSortBy' })

@InputType('GetStatisticsProvidersNationalId')
export class GetStatisticsProvidersNationalId {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => StatisticsSortBy, { nullable: true })
  sortBy?: StatisticsSortBy

  @Field(() => Boolean, { nullable: true })
  desc?: boolean

  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @Min(1)
  pageSize?: number
}
