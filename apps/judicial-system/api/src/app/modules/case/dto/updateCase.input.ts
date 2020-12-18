import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  UpdateCase,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateCaseInput implements UpdateCase {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedName?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedAddress?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedGender?: CaseGender

  @Allow()
  @Field({ nullable: true })
  readonly requestedDefenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedDefenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly court?: string

  @Allow()
  @Field({ nullable: true })
  readonly arrestDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedCourtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly alternativeTravelBan?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly requestedCustodyEndDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly lawsBroken?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly custodyProvisions?: CaseCustodyProvisions[]

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field({ nullable: true })
  readonly caseFacts?: string

  @Allow()
  @Field({ nullable: true })
  readonly legalArguments?: string

  @Allow()
  @Field({ nullable: true })
  readonly comments?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtRoom?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtStartTime?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtAttendees?: string

  @Allow()
  @Field({ nullable: true })
  readonly policeDemands?: string

  @Allow()
  @Field({ nullable: true })
  readonly accusedPlea?: string

  @Allow()
  @Field({ nullable: true })
  readonly litigationPresentations?: string

  @Allow()
  @Field({ nullable: true })
  readonly ruling?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly decision?: CaseDecision

  @Allow()
  @Field({ nullable: true })
  readonly custodyEndDate?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly custodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Allow()
  @Field({ nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorAppealAnnouncement?: string
}
