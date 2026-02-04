import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'

interface UpdateDateLog {
  date?: Date
  location?: string
  /** When rescheduling arraignment: only create subpoenas for these defendants. Omit = all non-alternative-service defendants. */
  selectedDefendantIds?: string[]
}

export interface UpdateCase
  extends Pick<
    Case,
    | 'indictmentSubtypes'
    | 'description'
    | 'defenderName'
    | 'defenderNationalId'
    | 'defenderEmail'
    | 'defenderPhoneNumber'
    | 'isHeightenedSecurityLevel'
    | 'courtId'
    | 'leadInvestigator'
    | 'arrestDate'
    | 'requestedCourtDate'
    | 'translator'
    | 'requestedValidToDate'
    | 'demands'
    | 'lawsBroken'
    | 'legalBasis'
    | 'legalProvisions'
    | 'requestedCustodyRestrictions'
    | 'requestedOtherRestrictions'
    | 'caseFacts'
    | 'legalArguments'
    | 'requestProsecutorOnlySession'
    | 'prosecutorOnlySessionRequest'
    | 'comments'
    | 'caseFilesComments'
    | 'prosecutorId'
    | 'sharedWithProsecutorsOfficeId'
    | 'sessionArrangements'
    | 'courtLocation'
    | 'courtStartDate'
    | 'courtEndTime'
    | 'isClosedCourtHidden'
    | 'courtAttendees'
    | 'prosecutorDemands'
    | 'courtDocuments'
    | 'sessionBookings'
    | 'courtCaseFacts'
    | 'introduction'
    | 'courtLegalArguments'
    | 'ruling'
    | 'decision'
    | 'validToDate'
    | 'isCustodyIsolation'
    | 'isolationToDate'
    | 'conclusion'
    | 'endOfSessionBookings'
    | 'accusedAppealDecision'
    | 'accusedAppealAnnouncement'
    | 'prosecutorAppealDecision'
    | 'prosecutorAppealAnnouncement'
    | 'accusedPostponedAppealDate'
    | 'prosecutorPostponedAppealDate'
    | 'caseModifiedExplanation'
    | 'rulingModifiedHistory'
    | 'caseResentExplanation'
    | 'crimeScenes'
    | 'indictmentIntroduction'
    | 'requestDriversLicenseSuspension'
    | 'creatingProsecutorId'
    | 'appealState'
    | 'prosecutorStatementDate'
    | 'appealReceivedByCourtDate'
    | 'appealCaseNumber'
    | 'appealAssistantId'
    | 'appealJudge1Id'
    | 'appealJudge2Id'
    | 'appealJudge3Id'
    | 'appealConclusion'
    | 'appealRulingDecision'
    | 'appealRulingModifiedHistory'
    | 'requestSharedWithDefender'
    | 'appealValidToDate'
    | 'isAppealCustodyIsolation'
    | 'appealIsolationToDate'
    | 'indictmentRulingDecision'
    | 'indictmentReviewerId'
    | 'indictmentReviewDecision'
    | 'indictmentDecision'
    | 'courtSessionType'
    | 'mergeCaseId'
    | 'mergeCaseNumber'
    | 'isCompletedWithoutRuling'
    | 'hasCivilClaims'
    | 'isRegisteredInPrisonSystem'
    | 'isArchived'
  > {
  type?: CaseType
  state?: CaseState
  policeCaseNumbers?: string[]
  defendantWaivesRightToCounsel?: boolean
  rulingDate?: Date | null
  courtCaseNumber?: string | null
  judgeId?: string | null
  registrarId?: string | null
  courtRecordSignatoryId?: string | null
  courtRecordSignatureDate?: Date | null
  parentCaseId?: string | null
  indictmentReturnedExplanation?: string | null
  indictmentDeniedExplanation?: string | null
  indictmentHash?: string | null
  arraignmentDate?: UpdateDateLog
  courtDate?: UpdateDateLog
  postponedIndefinitelyExplanation?: string
  civilDemands?: string
  penalties?: string
  rulingSignatureDate?: Date | null
  withCourtSessions?: boolean
  courtRecordHash?: string | null
}
