import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  Case as TCase,
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseState,
} from '@island.is/judicial-system/types'

import { User } from '../../user'
import { Notification } from './notification.model'

@ObjectType()
export class Case implements TCase {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field(() => String)
  readonly state!: CaseState

  @Field()
  readonly policeCaseNumber!: string

  @Field()
  readonly accusedNationalId!: string

  @Field({ nullable: true })
  readonly accusedName?: string

  @Field({ nullable: true })
  readonly accusedAddress?: string

  @Field(() => String, { nullable: true })
  readonly accusedGender?: CaseGender

  @Field({ nullable: true })
  readonly requestedDefenderName?: string

  @Field({ nullable: true })
  readonly requestedDefenderEmail?: string

  @Field({ nullable: true })
  readonly court?: string

  @Field({ nullable: true })
  readonly arrestDate?: string

  @Field({ nullable: true })
  readonly requestedCourtDate?: string

  @Field({ nullable: true })
  alternativeTravelBan?: boolean

  @Field({ nullable: true })
  readonly requestedCustodyEndDate?: string

  @Field({ nullable: true })
  readonly lawsBroken?: string

  @Field(() => [String], { nullable: true })
  readonly custodyProvisions?: CaseCustodyProvisions[]

  @Field(() => [String], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Field({ nullable: true })
  readonly caseFacts?: string

  @Field({ nullable: true })
  readonly witnessAccounts?: string

  @Field({ nullable: true })
  readonly investigationProgress?: string

  @Field({ nullable: true })
  readonly legalArguments?: string

  @Field({ nullable: true })
  readonly comments?: string

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Field({ nullable: true })
  readonly courtDate?: string

  @Field({ nullable: true })
  isCourtDateInThePast?: boolean

  @Field({ nullable: true })
  readonly courtRoom?: string

  @Field({ nullable: true })
  readonly defenderName?: string

  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Field({ nullable: true })
  readonly courtStartTime?: string

  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Field({ nullable: true })
  readonly courtAttendees?: string

  @Field({ nullable: true })
  readonly policeDemands?: string

  @Field({ nullable: true })
  readonly accusedPlea?: string

  @Field({ nullable: true })
  readonly litigationPresentations?: string

  @Field({ nullable: true })
  readonly ruling?: string

  @Field(() => String, { nullable: true })
  readonly decision?: CaseDecision

  @Field({ nullable: true })
  readonly custodyEndDate?: string

  @Field({ nullable: true })
  isCustodyEndDateInThePast?: boolean

  @Field(() => [String], { nullable: true })
  readonly custodyRestrictions?: CaseCustodyRestrictions[]

  @Field(() => String, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => [Notification], { nullable: true })
  readonly notifications?: Notification[]
}
