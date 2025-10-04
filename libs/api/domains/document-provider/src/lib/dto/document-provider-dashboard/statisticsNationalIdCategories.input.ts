import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'

@InputType('GetStatisticsCategoriesByNationalId')
export class GetStatisticsCategoriesByNationalId {
  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}
