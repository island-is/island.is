import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaymentMonth } from './paymentMonth'

@ObjectType('SocialInsurancePayment')
export class Payment {
  @Field()
  type!: string

  @Field(() => Int)
  totalYearCumulativeAmount?: number

  @Field(() => [PaymentMonth])
  monthlyPaymentHistory?: Array<PaymentMonth>
}
