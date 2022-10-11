import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApplicationInformationChildren } from './applicationInformationChildren.model'
import { ApplicationInformationEmployer } from './applicationInformationEmployer.model'
import { ApplicationRights } from './applicationRights.model'

import { ParentalLeavePaymentInfo } from './parentalLeavePaymentInfo.model'
import { ParentalLeavePeriod } from './parentalLeavePeriod.model'

@ObjectType()
export class ApplicationInformation {
  @Field(() => String)
  result!: string

  @Field(() => ID)
  applicationId!: string

  @Field(() => String)
  applicationFundId!: string

  @Field(() => String)
  nationalRegisteryId!: string

  @Field(() => String)
  dateOfBirth!: string

  @Field(() => String)
  expectedDateOfBirth!: string

  @Field(() => String)
  applicantId!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => ParentalLeavePaymentInfo)
  paymentInfo!: ParentalLeavePaymentInfo

  @Field(() => [ApplicationInformationChildren])
  children!: ApplicationInformationChildren[]

  @Field(() => String, { nullable: true })
  otherParentName!: string

  @Field(() => String, { nullable: true })
  otherParentId!: string

  @Field(() => String)
  status!: string

  @Field(() => [ParentalLeavePeriod])
  periods!: ParentalLeavePeriod[]

  @Field(() => [ApplicationRights])
  applicationRights!: ApplicationRights[]

  @Field(() => [ApplicationInformationEmployer])
  employers!: ApplicationInformationEmployer[]

  @Field(() => String, { nullable: true })
  testData!: string
}
