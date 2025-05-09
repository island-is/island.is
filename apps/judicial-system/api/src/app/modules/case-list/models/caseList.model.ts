import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  CourtSessionType,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  PunishmentType,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { EventLog } from '../../event-log'
import { Institution } from '../../institution'
import { User } from '../../user'

@ObjectType()
export class CaseListEntry {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly courtDate?: string

  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Field(() => CaseState, { nullable: true })
  readonly state?: CaseState

  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

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
  readonly rulingSignatureDate?: string

  @Field(() => String, { nullable: true })
  readonly courtEndTime?: string

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field(() => String, { nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorPostponedAppealDate?: string

  @Field(() => Institution, { nullable: true })
  readonly court?: Institution

  @Field(() => User, { nullable: true })
  readonly creatingProsecutor?: User

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => User, { nullable: true })
  readonly registrar?: User

  @Field(() => ID, { nullable: true })
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

  @Field(() => String, { nullable: true })
  readonly postponedIndefinitelyExplanation?: string

  @Field(() => User, { nullable: true })
  readonly indictmentReviewer?: User

  @Field(() => IndictmentCaseReviewDecision, { nullable: true })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision

  @Field(() => String, { nullable: true })
  readonly indictmentAppealDeadline?: string

  @Field(() => Boolean, { nullable: true })
  readonly indictmentVerdictViewedByAll?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly indictmentVerdictAppealDeadlineExpired?: boolean

  @Field(() => IndictmentDecision, { nullable: true })
  readonly indictmentDecision?: IndictmentDecision

  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @Field(() => CourtSessionType, { nullable: true })
  readonly courtSessionType?: CourtSessionType

  @Field(() => [EventLog], { nullable: true })
  readonly eventLogs?: EventLog[]

  // TEMP: Use with caution! This key will never be populated.
  // It was added to bypass table component type checks for a required custom sort key
  // until we have a resolution on how to handle multiple defendants in the case list
  @Field(() => PunishmentType, { nullable: true })
  readonly defendantsPunishmentType?: PunishmentType

  @Field(() => String, { nullable: true })
  readonly caseSentToCourtDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isCompletedWithoutRuling?: boolean

  // TEMP: This is a temporary solution to allow public prosecutor users to mark a case
  // as registered in the police system. This will be removed once this can be done
  // automatically.
  @Field(() => Boolean, { nullable: true })
  readonly publicProsecutorIsRegisteredInPoliceSystem?: boolean
}
