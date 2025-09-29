import { Field, GraphQLISODateTime, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsUUID, Max, Min } from 'class-validator'

export enum CategoryStatisticsSortBy {
  Date = 'Date',
  Published = 'Published',
}

registerEnumType(CategoryStatisticsSortBy, { name: 'CategoryStatisticsSortBy' })

@InputType(
  'GetStatisticsBreakdownWithCategoriesByProviderId',
)
export class GetStatisticsBreakdownWithCategoriesByProviderId {
  @Field()
  @IsUUID('4', { message: 'providerId must be a UUID v4' })
  providerId!: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date

  @Field(() => CategoryStatisticsSortBy, { nullable: true })
  sortBy?: CategoryStatisticsSortBy

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  desc?: boolean

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 25 })
  @IsOptional()
  @Min(1)
  @Max(100)
  pageSize?: number
}
