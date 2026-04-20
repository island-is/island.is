import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'

@InputType('DocumentProviderDashboardGetStatisticsCategoriesByNationalId')
export class DocumentProviderDashboardGetStatisticsCategoriesByNationalId {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}
