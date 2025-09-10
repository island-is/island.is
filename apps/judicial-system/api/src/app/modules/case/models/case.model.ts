import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseLegalProvisions,
  CaseOrigin,
  CaseState,
  CaseType,
  CourtDocument,
  CourtSessionType,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  CourtDocumentResponse,
  CourtSessionResponse,
} from '../../court-session'
import { CivilClaimant, Defendant } from '../../defendant'
import { CaseFile } from '../../file'
import { IndictmentCount } from '../../indictment-count'
import { Institution } from '../../institution'
import { User } from '../../user'
import { Victim } from '../../victim'
import { CaseRepresentative } from './caseRepresentative.model'
import { Notification } from './notification.model'

registerEnumType(CaseOrigin, { name: 'CaseOrigin' })
registerEnumType(CaseType, { name: 'CaseType' })
registerEnumType(CaseState, { name: 'CaseState' })
registerEnumType(RequestSharedWithDefender, {
  name: 'RequestSharedWithDefender',
})
registerEnumType(CaseLegalProvisions, { name: 'CaseLegalProvisions' })
registerEnumType(CaseCustodyRestrictions, { name: 'CaseCustodyRestrictions' })
registerEnumType(SessionArrangements, { name: 'SessionArrangements' })
registerEnumType(CaseDecision, { name: 'CaseDecision' })
registerEnumType(CaseAppealDecision, { name: 'CaseAppealDecision' })
registerEnumType(CaseAppealState, { name: 'CaseAppealState' })
registerEnumType(CaseAppealRulingDecision, { name: 'CaseAppealRulingDecision' })
registerEnumType(CaseIndictmentRulingDecision, {
  name: 'CaseIndictmentRulingDecision',
})
registerEnumType(IndictmentCaseReviewDecision, {
  name: 'IndictmentCaseReviewDecision',
})
registerEnumType(IndictmentDecision, { name: 'IndictmentDecision' })
registerEnumType(CourtSessionType, { name: 'CourtSessionType' })

@ObjectType()
class DateLog {
  @Field(() => String, { nullable: true })
  readonly date?: string

  @Field(() => String, { nullable: true })
  readonly location?: string
}

@ObjectType()
export class Case {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => CaseOrigin, { nullable: true })
  readonly origin?: CaseOrigin

  @Field(() => CaseType, { nullable: true })
  readonly type?: CaseType

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Field(() => String, { nullable: true })
  readonly description?: string

  @Field(() => CaseState, { nullable: true })
  readonly state?: CaseState

  @Field(() => [String], { nullable: true })
  readonly policeCaseNumbers?: string[]

  @Field(() => [Defendant], { nullable: true })
  readonly defendants?: Defendant[]

  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Field(() => String, { nullable: true })
  readonly defenderNationalId?: string

  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Field(() => RequestSharedWithDefender, { nullable: true })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @Field(() => Boolean, { nullable: true })
  isHeightenedSecurityLevel?: boolean

  @Field(() => Institution, { nullable: true })
  readonly court?: Institution

  @Field(() => String, { nullable: true })
  readonly leadInvestigator?: string

  @Field(() => String, { nullable: true })
  readonly arrestDate?: string

  @Field(() => String, { nullable: true })
  readonly requestedCourtDate?: string

  @Field(() => String, { nullable: true })
  readonly translator?: string

  @Field(() => String, { nullable: true })
  readonly requestedValidToDate?: string

  @Field(() => String, { nullable: true })
  readonly demands?: string

  @Field(() => String, { nullable: true })
  readonly lawsBroken?: string

  @Field(() => String, { nullable: true })
  readonly legalBasis?: string

  @Field(() => [CaseLegalProvisions], { nullable: true })
  readonly legalProvisions?: CaseLegalProvisions[]

  @Field(() => [CaseCustodyRestrictions], { nullable: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @Field(() => String, { nullable: true })
  readonly requestedOtherRestrictions?: string

  @Field(() => String, { nullable: true })
  readonly caseFacts?: string

  @Field(() => String, { nullable: true })
  readonly legalArguments?: string

  @Field(() => Boolean, { nullable: true })
  readonly requestProsecutorOnlySession?: boolean

  @Field(() => String, { nullable: true })
  readonly prosecutorOnlySessionRequest?: string

  @Field(() => String, { nullable: true })
  readonly comments?: string

  @Field(() => String, { nullable: true })
  readonly caseFilesComments?: string

  @Field(() => User, { nullable: true })
  readonly creatingProsecutor?: User

  @Field(() => User, { nullable: true })
  readonly prosecutor?: User

  @Field(() => Institution, { nullable: true })
  readonly sharedWithProsecutorsOffice?: Institution

  @Field(() => String, { nullable: true })
  readonly courtCaseNumber?: string

  @Field(() => SessionArrangements, { nullable: true })
  readonly sessionArrangements?: SessionArrangements

  @Field(() => DateLog, { nullable: true })
  readonly arraignmentDate?: DateLog

  @Field(() => DateLog, { nullable: true })
  readonly courtDate?: DateLog

  @Field(() => String, { nullable: true })
  readonly courtLocation?: string

  @Field(() => String, { nullable: true })
  readonly courtStartDate?: string

  @Field(() => String, { nullable: true })
  readonly courtEndTime?: string

  @Field(() => Boolean, { nullable: true })
  readonly isClosedCourtHidden?: boolean

  @Field(() => String, { nullable: true })
  readonly courtAttendees?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorDemands?: string

  @Field(() => [GraphQLJSONObject], { nullable: true })
  readonly courtDocuments?: CourtDocument[]

  @Field(() => String, { nullable: true })
  readonly sessionBookings?: string

  @Field(() => String, { nullable: true })
  readonly courtCaseFacts?: string

  @Field(() => String, { nullable: true })
  readonly introduction?: string

  @Field(() => String, { nullable: true })
  readonly courtLegalArguments?: string

  @Field(() => String, { nullable: true })
  readonly ruling?: string

  @Field(() => CaseDecision, { nullable: true })
  readonly decision?: CaseDecision

  @Field(() => String, { nullable: true })
  readonly validToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isValidToDateInThePast?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly isCustodyIsolation?: boolean

  @Field(() => String, { nullable: true })
  readonly isolationToDate?: string

  @Field(() => String, { nullable: true })
  readonly conclusion?: string

  @Field(() => String, { nullable: true })
  readonly endOfSessionBookings?: string

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly accusedAppealDecision?: CaseAppealDecision

  @Field(() => String, { nullable: true })
  readonly accusedAppealAnnouncement?: string

  @Field(() => CaseAppealDecision, { nullable: true })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @Field(() => String, { nullable: true })
  readonly prosecutorAppealAnnouncement?: string

  @Field(() => String, { nullable: true })
  readonly accusedPostponedAppealDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorPostponedAppealDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isAppealDeadlineExpired?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly isAppealGracePeriodExpired?: boolean

  @Field(() => String, { nullable: true })
  readonly rulingDate?: string

  @Field(() => String, { nullable: true })
  readonly rulingSignatureDate?: string

  @Field(() => String, { nullable: true })
  readonly initialRulingDate?: string

  @Field(() => User, { nullable: true })
  readonly judge?: User

  @Field(() => User, { nullable: true })
  readonly registrar?: User

  @Field(() => User, { nullable: true })
  readonly courtRecordSignatory?: User

  @Field(() => String, { nullable: true })
  readonly courtRecordSignatureDate?: string

  @Field(() => Case, { nullable: true })
  readonly parentCase?: Case

  @Field(() => Case, { nullable: true })
  readonly childCase?: Case

  @Field(() => [Notification], { nullable: true })
  readonly notifications?: Notification[]

  @Field(() => [CaseFile], { nullable: true })
  readonly caseFiles?: CaseFile[]

  @Field(() => String, { nullable: true })
  readonly caseModifiedExplanation?: string

  @Field(() => String, { nullable: true })
  readonly rulingModifiedHistory?: string

  @Field(() => String, { nullable: true })
  readonly caseResentExplanation?: string

  @Field(() => String, { nullable: true })
  readonly openedByDefender?: string

  @Field(() => Boolean, { nullable: true })
  readonly defendantWaivesRightToCounsel?: boolean

  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap

  @Field(() => String, { nullable: true })
  readonly indictmentIntroduction?: string

  @Field(() => [IndictmentCount], { nullable: true })
  readonly indictmentCounts?: IndictmentCount[]

  @Field(() => [CourtSessionResponse], { nullable: true })
  readonly courtSessions?: CourtSessionResponse[]

  @Field(() => [CourtDocumentResponse], { nullable: true })
  readonly unfiledCourtDocuments?: CourtDocumentResponse[]

  @Field(() => Boolean, { nullable: true })
  readonly requestDriversLicenseSuspension?: boolean

  @Field(() => CaseAppealState, { nullable: true })
  readonly appealState?: CaseAppealState

  @Field(() => Boolean, { nullable: true })
  readonly isStatementDeadlineExpired?: boolean

  @Field(() => String, { nullable: true })
  readonly statementDeadline?: string

  @Field(() => Boolean, { nullable: true })
  readonly canBeAppealed?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly canProsecutorAppeal?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly canDefenderAppeal?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly hasBeenAppealed?: boolean

  @Field(() => String, {
    nullable: true,
    description: 'appeal deadline in R cases',
  })
  readonly appealDeadline?: string

  @Field(() => UserRole, { nullable: true })
  readonly appealedByRole?: UserRole

  @Field(() => String, { nullable: true })
  readonly appealedDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutorStatementDate?: string

  @Field(() => String, { nullable: true })
  readonly defendantStatementDate?: string

  @Field(() => String, { nullable: true })
  readonly appealReceivedByCourtDate?: string

  @Field(() => String, { nullable: true })
  readonly appealConclusion?: string

  @Field(() => CaseAppealRulingDecision, { nullable: true })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @Field(() => String, { nullable: true })
  readonly appealCaseNumber?: string

  @Field(() => User, { nullable: true })
  readonly appealAssistant?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge1?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge2?: User

  @Field(() => User, { nullable: true })
  readonly appealJudge3?: User

  @Field(() => String, { nullable: true })
  readonly appealRulingModifiedHistory?: string

  @Field(() => String, { nullable: true })
  readonly appealValidToDate?: string

  @Field(() => Boolean, { nullable: true })
  readonly isAppealCustodyIsolation?: boolean

  @Field(() => String, { nullable: true })
  readonly appealIsolationToDate?: string

  @Field(() => [UserRole], { nullable: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @Field(() => Institution, { nullable: true })
  readonly prosecutorsOffice?: Institution

  @Field(() => String, { nullable: true })
  readonly indictmentDeniedExplanation?: string

  @Field(() => String, { nullable: true })
  readonly indictmentReturnedExplanation?: string

  @Field(() => String, { nullable: true })
  readonly postponedIndefinitelyExplanation?: string

  @Field(() => CaseIndictmentRulingDecision, { nullable: true })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @Field(() => User, { nullable: true })
  readonly indictmentReviewer?: User

  @Field(() => IndictmentCaseReviewDecision, { nullable: true })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision

  @Field(() => String, {
    nullable: true,
    description: 'appeal deadline for public prosecutor',
  })
  readonly indictmentAppealDeadline?: string

  @Field(() => Boolean, { nullable: true })
  readonly indictmentVerdictViewedByAll?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly indictmentVerdictAppealDeadlineExpired?: boolean

  @Field(() => IndictmentDecision, { nullable: true })
  readonly indictmentDecision?: IndictmentDecision

  @Field(() => CourtSessionType, { nullable: true })
  readonly courtSessionType?: CourtSessionType

  @Field(() => Case, { nullable: true })
  readonly mergeCase?: Case

  @Field(() => [Case], { nullable: true })
  readonly mergedCases?: Case[]

  @Field(() => String, { nullable: true })
  readonly mergeCaseNumber?: string

  @Field(() => [CivilClaimant], { nullable: true })
  readonly civilClaimants?: CivilClaimant[]

  @Field(() => String, { nullable: true })
  readonly civilDemands?: string

  @Field(() => Boolean, { nullable: true })
  readonly hasCivilClaims?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly isCompletedWithoutRuling?: boolean

  @Field(() => String, { nullable: true })
  readonly caseSentToCourtDate?: string

  @Field(() => String, { nullable: true })
  readonly indictmentReviewedDate?: string

  @Field(() => String, { nullable: true })
  readonly indictmentSentToPublicProsecutorDate?: string

  @Field(() => String, { nullable: true })
  readonly defenceAppealResultAccessDate?: string

  @Field(() => String, { nullable: true })
  readonly prosecutionAppealResultAccessDate?: string

  @Field(() => String, { nullable: true })
  readonly prisonStaffAppealResultAccessDate?: string

  @Field(() => String, { nullable: true })
  readonly requestCompletedDate?: string

  @Field(() => [Victim], { nullable: true })
  readonly victims?: Victim[]

  @Field(() => [CaseRepresentative], { nullable: true })
  readonly caseRepresentatives?: CaseRepresentative[]

  @Field(() => Boolean, { nullable: true })
  readonly publicProsecutorIsRegisteredInPoliceSystem?: boolean

  @Field(() => Boolean, { nullable: true })
  readonly isRegisteredInPrisonSystem?: boolean
}
