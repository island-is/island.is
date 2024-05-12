import { Allow, IsArray } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, InputType } from '@nestjs/graphql'

import type {
  CourtDocument,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseLegalProvisions,
  CaseType,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

@InputType()
class UpdateDateLog {
  @Allow()
  @Field(() => String, { nullable: true })
  readonly date?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly location?: string
}

@InputType()
export class UpdateCaseInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @Field(() => String, { nullable: true })
  readonly description?: string

  @Allow()
  @IsArray()
  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field(() => RequestSharedWithDefender, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly isHeightenedSecurityLevel?: boolean

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly courtId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly arrestDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly requestedCourtDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly translator?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly requestedValidToDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly demands?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly lawsBroken?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly legalBasis?: string

  @Allow()
  @IsArray()
  @Field(() => [CaseLegalProvisions], { nullable: true })
  readonly legalProvisions?: CaseLegalProvisions[]

  @Allow()
  @IsArray()
  @Field(() => [CaseCustodyRestrictions], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly requestedOtherRestrictions?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly caseFacts?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly legalArguments?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly requestProsecutorOnlySession?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorOnlySessionRequest?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly comments?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly caseFilesComments?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly prosecutorId?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly sharedWithProsecutorsOfficeId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtCaseNumber?: string

  @Allow()
  @Field(() => SessionArrangements, { nullable: true })
  readonly sessionArrangements?: SessionArrangements

  @Allow()
  @Field(() => UpdateDateLog, { nullable: true })
  readonly arraignmentDate?: UpdateDateLog

  @Allow()
  @Field(() => UpdateDateLog, { nullable: true })
  readonly courtDate?: UpdateDateLog

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtLocation?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtStartDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtEndTime?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly isClosedCourtHidden?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtAttendees?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorDemands?: string

  @Allow()
  @IsArray()
  @Field(() => [GraphQLJSONObject], { nullable: true })
  readonly courtDocuments?: CourtDocument[]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly sessionBookings?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtCaseFacts?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly introduction?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly courtLegalArguments?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly ruling?: string

  @Allow()
  @Field(() => CaseDecision, { nullable: true })
  readonly decision?: CaseDecision

  @Allow()
  @Field(() => String, { nullable: true })
  readonly validToDate?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly isCustodyIsolation?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly isolationToDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly conclusion?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly endOfSessionBookings?: string

  @Allow()
  @Field(() => CaseAppealDecision, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Allow()
  @Field(() => String, { nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Allow()
  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly rulingSignatureDate?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly judgeId?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly registrarId?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly caseModifiedExplanation?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly rulingModifiedHistory?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly caseResentExplanation?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap

  @Allow()
  @Field(() => String, { nullable: true })
  readonly indictmentIntroduction?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly requestDriversLicenseSuspension?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly appealAssistantId?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly appealJudge1Id?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly appealJudge2Id?: string

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly appealJudge3Id?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Allow()
  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Allow()
  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Allow()
  @IsArray()
  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly indictmentDeniedExplanation?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly indictmentReturnedExplanation?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly postponedIndefinitelyExplanation?: string

  @Allow()
  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @Allow()
  @Field(() => ID, { nullable: true })
  readonly indictmentReviewerId?: string
}
