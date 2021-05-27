import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  AccusedPleaDecision,
  Case as TCase,
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { User } from '../../user'
import { CaseFile } from '../../file'
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
  readonly type!: CaseType

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
  readonly defenderName?: string

  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Field({ nullable: true })
  sendRequestToDefender?: boolean

  @Field({ nullable: true })
  readonly court?: string

  @Field({ nullable: true })
  readonly leadInvestigator?: string

  @Field({ nullable: true })
  readonly arrestDate?: string

  @Field({ nullable: true })
  readonly requestedCourtDate?: string

  @Field({ nullable: true })
  readonly requestedCustodyEndDate?: string

  @Field({ nullable: true })
  readonly otherDemands?: string

  @Field({ nullable: true })
  readonly lawsBroken?: string

  @Field(() => [String], { nullable: true })
  readonly custodyProvisions?: CaseCustodyProvisions[]

  @Field(() => [String], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Field({ nullable: true })
  readonly requestedOtherRestrictions?: string

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

  @Field({ nullable: true })
  readonly caseFilesComments?: string

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Field({ nullable: true })
  readonly courtDate?: string

  @Field({ nullable: true })
  readonly courtRoom?: string

  @Field({ nullable: true })
  readonly courtStartDate?: string

  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Field({ nullable: true })
  readonly courtAttendees?: string

  @Field({ nullable: true })
  readonly policeDemands?: string

  @Field(() => [String], { nullable: true })
  readonly courtDocuments?: string[]

  @Field({ nullable: true })
  readonly additionToConclusion?: string

  @Field(() => String, { nullable: true })
  readonly accusedPleaDecision?: AccusedPleaDecision

  @Field({ nullable: true })
  readonly accusedPleaAnnouncement?: string

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

  @Field({ nullable: true })
  readonly otherRestrictions?: string

  @Field({ nullable: true })
  readonly isolationTo?: string

  @Field(() => String, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Field({ nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field({ nullable: true })
  readonly prosecutorPostponedAppealDate?: string

  @Field({ nullable: true })
  isAppealDeadlineExpired?: boolean

  @Field({ nullable: true })
  isAppealGracePeriodExpired?: boolean

  @Field({ nullable: true })
  readonly rulingDate?: string

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => User, { nullable: true })
  readonly registrar?: User

  @Field(() => Case, { nullable: true })
  readonly parentCase?: Case

  @Field(() => Case, { nullable: true })
  readonly childCase?: Case

  @Field(() => [Notification], { nullable: true })
  readonly notifications?: Notification[]

  @Field(() => [CaseFile], { nullable: true })
  readonly files?: CaseFile[]
}
