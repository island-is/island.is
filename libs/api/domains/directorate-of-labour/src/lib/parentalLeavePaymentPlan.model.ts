import { Field, ObjectType, Float } from '@nestjs/graphql'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

@ObjectType()
export class ParentalLeavePaymentPlan {
  @Field(() => Float)
  estimatedAmount!: number

  @Field(() => Float)
  pensionAmount!: number

  @Field(() => Float)
  privatePensionAmount!: number

  @Field(() => Float)
  unionAmount!: number

  @Field(() => Float)
  taxAmount!: number

  @Field(() => Float)
  estimatePayment!: number

  @Field(() => ParentalLeavePeriod)
  period!: ParentalLeavePeriod
}
