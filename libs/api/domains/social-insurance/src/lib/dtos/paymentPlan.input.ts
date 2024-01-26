import { InputType, Field, Int } from '@nestjs/graphql'

@InputType('SocialInsurancePaymentPlanInput')
export class PaymentPlanInput {
  @Field(() => Int)
  year?: number
}
