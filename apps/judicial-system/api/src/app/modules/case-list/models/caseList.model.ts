import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { Institution } from '../../institution'
import { User } from '../../user'

@ObjectType()
export class CaseListEntry {
  @Field(() => ID)
  readonly id!: string

  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly courtDate?: string

  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Field(() => CaseState, { nullable: true })
  readonly state?: CaseState

  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

  @Field(() => [Defendant], { nullable: true })
  readonly defendants?: Defendant[]

  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Field(() => CaseDecision, { nullable: true })
  readonly decision?: CaseDecision

  @Field({ nullable: true })
  readonly validToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isValidToDateInThePast?: boolean

  @Field({ nullable: true })
  readonly initialRulingDate?: string

  @Field({ nullable: true })
  readonly rulingDate?: string

  @Field({ nullable: true })
  readonly rulingSignatureDate?: string

  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field({ nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field({ nullable: true })
  readonly prosecutorPostponedAppealDate?: string

  @Field(() => User, { nullable: true })
  readonly creatingProsecutor?: User

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => User, { nullable: true })
  readonly registrar?: User

  @Field({ nullable: true })
  readonly parentCaseId?: string

  @Field(() => CaseAppealState, { nullable: true })
  readonly appealState?: CaseAppealState

  @Field(() => String, { nullable: true })
  readonly appealedDate?: string

  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Field(() => Institution, { nullable: true })
  readonly prosecutorsOffice?: Institution
}
