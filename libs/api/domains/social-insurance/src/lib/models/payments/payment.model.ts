import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaymentMonth } from './paymentMonth.model'

@ObjectType('SocialInsurancePayment')
export class Payment {
  @Field()
  name!: string

  @Field(() => Int)
  totalYearCumulativeAmount!: number

  @Field(() => [PaymentMonth])
  monthlyPaymentHistory!: Array<PaymentMonth>
}
