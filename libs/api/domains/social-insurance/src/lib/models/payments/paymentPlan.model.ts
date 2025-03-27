import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaymentGroup } from './paymentGroup.model'
import { PaymentMonth } from './paymentMonth.model'

@ObjectType('SocialInsurancePaymentPlan')
export class PaymentPlan {
  @Field(() => Int, { nullable: true })
  totalPayments?: number

  @Field(() => Int, { nullable: true })
  totalPaymentsSubtraction?: number

  @Field(() => Int, { nullable: true })
  totalPaymentsReceived?: number

  @Field(() => Array<PaymentMonth>, { nullable: true })
  totalMonthlyPaymentHistory?: Array<PaymentMonth>

  @Field(() => [PaymentGroup], { nullable: true })
  paymentGroups?: Array<PaymentGroup>
}
