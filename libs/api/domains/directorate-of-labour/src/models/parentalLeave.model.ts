import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { ParentalLeaveAttachment } from './parentalLeaveAttachment.model'
import { ParentalLeaveEmployer } from './parentalLeaveEmployer.model'
import { ParentalLeavePaymentInfo } from './parentalLeavePaymentInfo.model'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

@ObjectType()
export class ParentalLeave {
  @Field(() => ID)
  applicationId!: string

  @Field(() => String)
  applicant!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  otherParentId?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  expectedDateOfBirth?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  dateOfBirth?: string | null

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
  @IsOptional()
  rightsCode?: string | null

  @Field(() => [ParentalLeaveAttachment], { nullable: true })
  @IsOptional()
  attachments?: ParentalLeaveAttachment[] | null
}
