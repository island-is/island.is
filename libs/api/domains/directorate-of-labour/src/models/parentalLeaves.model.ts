import { Field, ObjectType, Float, ID } from '@nestjs/graphql'

import { ParentalLeaveEmployer } from './parentalLeaveEmployer.model'
import { ParentalLeavePaymentInfo } from './parentalLeavePaymentInfo.model'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

@ObjectType()
export class ParentalLeave {
  @Field(() => ID)
  applicationId!: string

  @Field(() => String)
  applicant!: string

  @Field(() => Float)
  otherParentId!: string

  @Field(() => String)
  expectedDateOfBirth!: string

  @Field(() => String)
  dateOfBirth!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => ParentalLeavePaymentInfo)
  paymentInfo!: ParentalLeavePaymentInfo

  @Field(() => [ParentalLeavePeriod])
  periods!: ParentalLeavePeriod[]

  @Field(() => [ParentalLeaveEmployer])
  employers!: ParentalLeaveEmployer[]

  @Field(() => String)
  status!: string

  @Field(() => String, { nullable: true })
  rightsCode?: string | null
}
