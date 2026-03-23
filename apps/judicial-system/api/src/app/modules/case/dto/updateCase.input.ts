import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'
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
  CourtSessionType,
  IndictmentDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

@InputType()
class UpdateDateLog {
  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly date?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly location?: string
}

@InputType()
export class UpdateCaseInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @IsOptional()
  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly description?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => RequestSharedWithDefender, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isHeightenedSecurityLevel?: boolean

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly courtId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly arrestDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly requestedCourtDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly translator?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly requestedValidToDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly demands?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly lawsBroken?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly legalBasis?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(CaseLegalProvisions, { each: true })
  @Field(() => [CaseLegalProvisions], { nullable: true })
  readonly legalProvisions?: CaseLegalProvisions[]

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @Field(() => [CaseCustodyRestrictions], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly requestedOtherRestrictions?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly caseFacts?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly legalArguments?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly requestProsecutorOnlySession?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorOnlySessionRequest?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly comments?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly caseFilesComments?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly prosecutorId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly sharedWithProsecutorsOfficeId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtCaseNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => SessionArrangements, { nullable: true })
  readonly sessionArrangements?: SessionArrangements

  @Allow()
  @IsOptional()
  @Field(() => UpdateDateLog, { nullable: true })
  readonly arraignmentDate?: UpdateDateLog

  @Allow()
  @IsOptional()
  @Field(() => UpdateDateLog, { nullable: true })
  readonly courtDate?: UpdateDateLog

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtLocation?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtStartDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtEndTime?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isClosedCourtHidden?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtAttendees?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorDemands?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @Field(() => [GraphQLJSONObject], { nullable: true })
  readonly courtDocuments?: CourtDocument[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly sessionBookings?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtCaseFacts?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly introduction?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtLegalArguments?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly ruling?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseDecision, { nullable: true })
  readonly decision?: CaseDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly validToDate?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isCustodyIsolation?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly isolationToDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly conclusion?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly endOfSessionBookings?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseAppealDecision, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly rulingSignatureDate?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly judgeId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly registrarId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly caseModifiedExplanation?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly rulingModifiedHistory?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly caseResentExplanation?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly indictmentIntroduction?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly requestDriversLicenseSuspension?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealAssistantId?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge1Id?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge2Id?: string

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly appealJudge3Id?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly indictmentDeniedExplanation?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly indictmentReturnedExplanation?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly postponedIndefinitelyExplanation?: string

  @Allow()
  @IsOptional()
  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly indictmentReviewerId?: string

  @Allow()
  @IsOptional()
  @Field(() => IndictmentDecision, { nullable: true })
  readonly indictmentDecision?: IndictmentDecision

  @Allow()
  @IsOptional()
  @Field(() => CourtSessionType, { nullable: true })
  readonly courtSessionType?: CourtSessionType

  @Allow()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  readonly mergeCaseId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly mergeCaseNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly civilDemands?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly hasCivilClaims?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isCompletedWithoutRuling?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isRegisteredInPrisonSystem?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly penalties?: string
}
