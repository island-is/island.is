import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'

@InputType()
export class HousingBenefitPaymentsInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => Int, { nullable: true })
  pageNumber?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
