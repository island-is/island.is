import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  CourtSessionType,
  IndictmentDecision,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'

@ObjectType()
export class CaseListEntry {
  @Field(() => ID)
  readonly id!: string

  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

  @Field(() => CaseState, { nullable: true })
  readonly state?: CaseState

  @Field(() => String, { nullable: true })
  readonly courtDate?: string

  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Field(() => [Defendant], { nullable: true })
  readonly defendants?: Defendant[]

  @Field(() => String, { nullable: true })
  readonly courtCaseNumber?: string

  @Field(() => CaseDecision, { nullable: true })
  readonly decision?: CaseDecision

  @Field(() => String, { nullable: true })
  readonly validToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isValidToDateInThePast?: boolean

  @Field(() => String, { nullable: true })
  readonly initialRulingDate?: string

  @Field(() => String, { nullable: true })
  readonly rulingDate?: string

  @Field(() => String, { nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field(() => ID, { nullable: true })
  readonly parentCaseId?: string

  @Field(() => CaseAppealState, { nullable: true })
  readonly appealState?: CaseAppealState

  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Field(() => String, { nullable: true })
  readonly postponedIndefinitelyExplanation?: string

  @Field(() => IndictmentDecision, { nullable: true })
  readonly indictmentDecision?: IndictmentDecision

  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @Field(() => CourtSessionType, { nullable: true })
  readonly courtSessionType?: CourtSessionType

  @Field(() => String, { nullable: true })
  readonly caseSentToCourtDate?: string
}
