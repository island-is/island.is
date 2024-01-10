import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('socialInsurancePaymentPlan')
export class PaymentPlan {
  @Field(() => Int, { nullable: true })
  nextPayment?: number

  @Field(() => Int, { nullable: true })
  previousPayment?: number
}
