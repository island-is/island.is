import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../../file'
import { User } from '../../user'
import { AppealEventLog } from './appealEventLog.response'

registerEnumType(AppealCaseState, { name: 'AppealCaseState' })
registerEnumType(AppealCaseType, { name: 'AppealCaseType' })
registerEnumType(AppealCaseRulingDecision, { name: 'AppealCaseRulingDecision' })

@ObjectType()
export class AppealDefendantStatementDate {
  @Field(() => ID)
  readonly defendantId!: string

  @Field(() => String)
  readonly statementDate!: string
}

@ObjectType()
export class AppealCivilClaimantStatementDate {
  @Field(() => ID)
  readonly civilClaimantId!: string

  @Field(() => String)
  readonly statementDate!: string
}

@ObjectType()
export class AppealCase {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => AppealCaseState, { nullable: true })
  readonly appealState?: AppealCaseState

  // RULING for a kæra, VERDICT for an áfrýjun.
  @Field(() => AppealCaseType, { nullable: true })
  readonly appealType?: AppealCaseType

  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly appealReceivedByCourtDate?: string

  @Field(() => String, { nullable: true })
  readonly appealRulingDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string

  @Field(() => [AppealDefendantStatementDate], { nullable: true })
  readonly defendantStatementDates?: AppealDefendantStatementDate[]

  @Field(() => [AppealCivilClaimantStatementDate], { nullable: true })
  readonly civilClaimantStatementDates?: AppealCivilClaimantStatementDate[]

  @Field(() => User, { nullable: true })
  readonly appealAssistant?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge1?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge2?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge3?: User

  @Field(() => AppealCaseRulingDecision, { nullable: true })
  readonly appealRulingDecision?: AppealCaseRulingDecision

  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Field(() => ID, { nullable: true })
  readonly appealedByDefendantId?: string

  @Field(() => ID, { nullable: true })
  readonly appealedByCivilClaimantId?: string

  @Field(() => UserRole, { nullable: true })
  readonly appealedByRole?: UserRole

  @Field(() => String, { nullable: true })
  readonly appealedDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly appealedInCourt?: boolean

  // A party filed the appeal itself rather than it being recorded in court.
  // Unlike appealedInCourt this is meaningful for case-level appeals, since it
  // comes from the appeal event's origin rather than a ruling's decision rows.
  @Field(() => Boolean, { nullable: true })
  readonly appealedOutOfCourt?: boolean

  @Field(() => String, { nullable: true })
  readonly statementDeadline?: string

  @Field(() => Boolean, { nullable: true })
  readonly isStatementDeadlineExpired?: boolean

  @Field(() => ID, { nullable: true })
  readonly rulingFileId?: string

  @Field(() => CaseFile, { nullable: true })
  readonly rulingFile?: CaseFile

  // Only carried by a verdict appeal case: the backend folds the event log of a
  // kæra into the appealedBy* fields above and strips it from the payload.
  @Field(() => [AppealEventLog], { nullable: true })
  readonly appealEventLogs?: AppealEventLog[]
}
