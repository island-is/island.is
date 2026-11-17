import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApplicationInformationChildren } from './applicationInformationChildren.model'
import { ApplicationInformationEmployer } from './applicationInformationEmployer.model'
import { ApplicationInformationPeriod } from './applicationInformationPeriod.model'
import { ApplicationRights } from './applicationRights.model'

import { ParentalLeavePaymentInfo } from './parentalLeavePaymentInfo.model'

@ObjectType()
export class ApplicationInformation {
  @Field(() => String, { nullable: true })
  result?: string | null

  @Field(() => ID)
  applicationId!: string

  @Field(() => String)
  applicationFundId!: string

  @Field(() => String, { nullable: true })
  nationalRegisteryId?: string | null

  @Field(() => String, { nullable: true })
  dateOfBirth?: string | null

  @Field(() => String, { nullable: true })
  expectedDateOfBirth?: string | null

  @Field(() => String, { nullable: true })
  applicantId?: string | null

  @Field(() => String)
  email!: string

  @Field(() => String)
  phoneNumber!: string

  @Field(() => ParentalLeavePaymentInfo)
  paymentInfo!: ParentalLeavePaymentInfo

  @Field(() => [ApplicationInformationChildren], { nullable: true })
  children?: ApplicationInformationChildren[] | null

  @Field(() => String, { nullable: true })
  otherParentName?: string | null

  @Field(() => String, { nullable: true })
  otherParentId?: string | null

  @Field(() => String)
  status!: string

  @Field(() => [ApplicationInformationPeriod])
  periods!: ApplicationInformationPeriod[]

  @Field(() => [ApplicationRights], { nullable: true })
  applicationRights?: ApplicationRights[] | null

  @Field(() => [ApplicationInformationEmployer])
  employers!: ApplicationInformationEmployer[]

  @Field(() => String, { nullable: true })
  testData?: string | null
}
