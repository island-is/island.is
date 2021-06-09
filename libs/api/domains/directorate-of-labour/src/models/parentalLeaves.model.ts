import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { ParentalLeavesAttachment } from './parentalLeavesAttachment.model'
import { ParentalLeavesEmployer } from './parentalLeavesEmployer.model'
import { ParentalLeavesPaymentInfo } from './parentalLeavesPaymentInfo.model'
import { ParentalLeavesPeriod } from './parentalLeavesPeriod.model'

@ObjectType()
export class ParentalLeave {
  @Field(() => ID)
  applicationId!: string

  @Field(() => String)
  applicant!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  otherParentId?: string | null

  @Field(() => String)
  expectedDateOfBirth!: string

  @Field(() => String)
  dateOfBirth!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => ParentalLeavesPaymentInfo)
  paymentInfo!: ParentalLeavesPaymentInfo

  @Field(() => [ParentalLeavesPeriod])
  periods!: ParentalLeavesPeriod[]

  @Field(() => [ParentalLeavesEmployer])
  employers!: ParentalLeavesEmployer[]

  @Field(() => String)
  status!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  rightsCode?: string | null

  @Field(() => [ParentalLeavesAttachment], { nullable: true })
  @IsOptional()
  attachments?: ParentalLeavesAttachment[] | null
}
