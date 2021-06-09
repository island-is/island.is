import { Field, ObjectType, Float } from '@nestjs/graphql'

import { ParentalLeavesPeriod } from './parentalLeavesPeriod.model'

@ObjectType()
export class ParentalLeavesPaymentPlan {
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

  @Field(() => ParentalLeavesPeriod)
  period!: ParentalLeavesPeriod
}
