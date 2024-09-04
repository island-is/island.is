import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Payment } from './payment.model'
import { PaymentMonth } from './paymentMonth.model'
import { PaymentGroupType } from './paymentGroupType.model'

@ObjectType('SocialInsurancePaymentGroup')
export class PaymentGroup {
  @Field(() => PaymentGroupType)
  type!: PaymentGroupType

  @Field()
  name!: string

  @Field(() => Int)
  totalYearCumulativeAmount!: number

  @Field(() => [Payment])
  payments!: Array<Payment>

  @Field(() => [PaymentMonth])
  monthlyPaymentHistory!: Array<PaymentMonth>
}
