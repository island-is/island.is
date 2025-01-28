import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PaymentMonth } from './paymentMonth.model'

@ObjectType('SocialInsurancePayment')
export class Payment {
  @Field()
  name!: string

  @Field(() => Int)
  totalYearCumulativeAmount!: number

  @Field({ nullable: true })
  markWithAsterisk?: boolean

  @Field(() => [PaymentMonth])
  monthlyPaymentHistory!: Array<PaymentMonth>
}
