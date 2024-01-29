import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Payment } from './payment.model'
import { PaymentMonth } from './paymentMonth'

@ObjectType('SocialInsurancePaymentGroup')
export class PaymentGroup {
  @Field({ description: 'Type of payment group' })
  type!: string

  @Field(() => Int)
  totalYearCumulativeAmount?: number

  @Field(() => [Payment])
  payments?: Array<Payment>

  @Field(() => [PaymentMonth])
  monthlyPaymentHistory?: Array<PaymentMonth>
}
