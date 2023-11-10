import { Allow } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, InputType } from '@nestjs/graphql'

import type {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseLegalProvisions,
  CaseType,
  CourtDocument,
  CrimeSceneMap,
  IndictmentSubtypeMap,
  RequestSharedWithDefender,
  SessionArrangements,
  UpdateCase,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateCaseInput implements UpdateCase {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly type?: CaseType

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @Field({ nullable: true })
  readonly description?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Allow()
  @Field({ nullable: true })
  readonly defenderName?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Allow()
  @Field({ nullable: true })
  readonly isHeightenedSecurityLevel?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly courtId?: string

  @Allow()
  @Field({ nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @Field({ nullable: true })
  readonly arrestDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedCourtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly translator?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestedValidToDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly demands?: string

  @Allow()
  @Field({ nullable: true })
  readonly lawsBroken?: string

  @Allow()
  @Field({ nullable: true })
  readonly legalBasis?: string

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly legalProvisions?: CaseLegalProvisions[]

  @Allow()
  @Field(() => [String], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Allow()
  @Field({ nullable: true })
  readonly requestedOtherRestrictions?: string

  @Allow()
  @Field({ nullable: true })
  readonly caseFacts?: string

  @Allow()
  @Field({ nullable: true })
  readonly legalArguments?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestProsecutorOnlySession?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorOnlySessionRequest?: string

  @Allow()
  @Field({ nullable: true })
  readonly comments?: string

  @Allow()
  @Field({ nullable: true })
  readonly caseFilesComments?: string

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorId?: string

  @Allow()
  @Field({ nullable: true })
  readonly sharedWithProsecutorsOfficeId?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtCaseNumber?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly sessionArrangements?: SessionArrangements

  @Allow()
  @Field({ nullable: true })
  readonly courtDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtLocation?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtRoom?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtStartDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtEndTime?: string

  @Allow()
  @Field({ nullable: true })
  readonly isClosedCourtHidden?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly courtAttendees?: string

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorDemands?: string

  @Allow()
  @Field(() => [GraphQLJSONObject], { nullable: true })
  readonly courtDocuments?: CourtDocument[]

  @Allow()
  @Field({ nullable: true })
  readonly sessionBookings?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtCaseFacts?: string

  @Allow()
  @Field({ nullable: true })
  readonly introduction?: string

  @Allow()
  @Field({ nullable: true })
  readonly courtLegalArguments?: string

  @Allow()
  @Field({ nullable: true })
  readonly ruling?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly decision?: CaseDecision

  @Allow()
  @Field({ nullable: true })
  readonly validToDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly isCustodyIsolation?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly isolationToDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly conclusion?: string

  @Allow()
  @Field({ nullable: true })
  readonly endOfSessionBookings?: string

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

  @Allow()
  @Field({ nullable: true })
  readonly judgeId?: string

  @Allow()
  @Field({ nullable: true })
  readonly registrarId?: string

  @Allow()
  @Field({ nullable: true })
  readonly caseModifiedExplanation?: string

  @Allow()
  @Field({ nullable: true })
  readonly rulingModifiedHistory?: string

  @Allow()
  @Field({ nullable: true })
  readonly caseResentExplanation?: string

  @Allow()
  @Field({ nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap

  @Allow()
  @Field({ nullable: true })
  readonly indictmentIntroduction?: string

  @Allow()
  @Field({ nullable: true })
  readonly requestDriversLicenseSuspension?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly prosecutorStatementDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly defendantStatementDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealCaseNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealAssistantId?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealJudge1Id?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealJudge2Id?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealJudge3Id?: string

  @Allow()
  @Field({ nullable: true })
  readonly appealConclusion?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Allow()
  @Field({ nullable: true })
  readonly appealRulingModifiedHistory?: string
}
