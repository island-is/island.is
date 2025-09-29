import { Field, Int, InputType, GraphQLISODateTime } from '@nestjs/graphql'

@InputType('GetStatisticsByNationalId')
export class GetStatisticsByNationalId {

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => GraphQLISODateTime, { nullable: true })
  from?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  to?: Date
}
