import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsurancePaymentTypeOverview')
export class PaymentTypeOverview {
  @Field({ nullable: true })
  name?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date
}
