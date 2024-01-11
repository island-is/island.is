import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class SocialInsurancePaymentPlanInput {
  @Field(() => Int)
  year?: number
}
