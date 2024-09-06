import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsurancePayments')
export class Payments {
  @Field(() => Int, { nullable: true })
  nextPayment?: number

  @Field(() => Int, { nullable: true })
  previousPayment?: number
}
