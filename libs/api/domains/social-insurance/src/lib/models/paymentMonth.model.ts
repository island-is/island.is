import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsurancePaymentMonth')
export class PaymentMonth {
  @Field(() => Int)
  monthIndex!: number

  @Field(() => Int)
  amount?: number
}
