import { Field, ObjectType, Float } from '@nestjs/graphql'

import { ParentalLeavesPensionFund } from './parentalLeavesPensionFund.model'
import { ParentalLeavesUnion } from './parentalLeavesUnion.model'

@ObjectType()
export class ParentalLeavesPaymentInfo {
  @Field(() => String)
  bankAccount!: string

  @Field(() => Float)
  personalAllowance!: number

  @Field(() => Float)
  personalAllowanceFromSpouse!: number

  @Field(() => ParentalLeavesUnion)
  union!: ParentalLeavesUnion

  @Field(() => ParentalLeavesPensionFund)
  pensionFund!: ParentalLeavesPensionFund

  @Field(() => ParentalLeavesPensionFund)
  privatePensionFund!: ParentalLeavesPensionFund

  @Field(() => Float)
  privatePensionFundRatio!: number
}
