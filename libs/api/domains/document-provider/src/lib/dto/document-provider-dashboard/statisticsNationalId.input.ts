import { Field, Int, InputType, GraphQLISODateTime } from '@nestjs/graphql'

@InputType('DocumentProviderDashboardGetStatisticsByNationalId')
export class DocumentProviderDashboardGetStatisticsByNationalId {
  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}
