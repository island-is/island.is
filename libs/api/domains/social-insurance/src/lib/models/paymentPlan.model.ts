import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaymentGroup } from './paymentGroup'

@ObjectType('SocialInsurancePaymentPlan')
export class PaymentPlan {
  @Field(() => Int, { nullable: true })
  nextPayment?: number

  @Field(() => Int, { nullable: true })
  previousPayment?: number

  @Field(() => [PaymentGroup])
  paymentGroups?: Array<PaymentGroup>
}
