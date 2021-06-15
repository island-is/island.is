import { Field, ObjectType, Float } from '@nestjs/graphql'

import { ParentalLeavePensionFund } from './parentalLeavePensionFund.model'
import { ParentalLeaveUnion } from './parentalLeaveUnion.model'

@ObjectType()
export class ParentalLeavePaymentInfo {
  @Field(() => String)
  bankAccount!: string

  @Field(() => Float)
  personalAllowance!: number

  @Field(() => Float)
  personalAllowanceFromSpouse!: number

  @Field(() => ParentalLeaveUnion)
  union!: ParentalLeaveUnion

  @Field(() => ParentalLeavePensionFund)
  pensionFund!: ParentalLeavePensionFund

  @Field(() => ParentalLeavePensionFund)
  privatePensionFund!: ParentalLeavePensionFund

  @Field(() => Float)
  privatePensionFundRatio!: number
}
