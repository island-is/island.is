import { Includeable, Op } from 'sequelize'

import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseType,
  completedIndictmentCaseStates,
  dateTypes,
  defendantEventTypes,
  eventTypes,
  notificationTypes,
  stringTypes,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CaseFile } from '../models/caseFile.model'
import { CaseString } from '../models/caseString.model'
import { CivilClaimant } from '../models/civilClaimant.model'
import { CourtDocument } from '../models/courtDocument.model'
import { CourtSession } from '../models/courtSession.model'
import { CourtSessionString } from '../models/courtSessionString.model'
import { DateLog } from '../models/dateLog.model'
import { Defendant } from '../models/defendant.model'
import { DefendantEventLog } from '../models/defendantEventLog.model'
import { EventLog } from '../models/eventLog.model'
import { IndictmentCount } from '../models/indictmentCount.model'
import { Institution } from '../models/institution.model'
import { Notification } from '../models/notification.model'
import { Offense } from '../models/offense.model'
import { Subpoena } from '../models/subpoena.model'
import { User } from '../models/user.model'
import { Verdict } from '../models/verdict.model'
import { Victim } from '../models/victim.model'

export const caseInclude: Includeable[] = [
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealAssistant',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge1',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge2',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge3',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'indictmentReviewer',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: Case,
    as: 'parentCase',
    include: [
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: { state: { [Op.not]: CaseFileState.DELETED }, category: null },
        separate: true,
      },
    ],
  },
  { model: Case, as: 'childCase' },
  {
    model: Defendant,
    as: 'defendants',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Subpoena,
        as: 'subpoenas',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
      },
      {
        model: DefendantEventLog,
        as: 'eventLogs',
        required: false,
        where: { eventType: defendantEventTypes },
        separate: true,
      },
      {
        model: Verdict,
        as: 'verdicts',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CivilClaimant,
    as: 'civilClaimants',
    required: false,
    order: [['created', 'ASC']],
    separate: true,
  },
  { model: Victim, as: 'victims', required: false },
  {
    model: IndictmentCount,
    as: 'indictmentCounts',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Offense,
        as: 'offenses',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CourtSession,
    as: 'courtSessions',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: User,
        as: 'judge',
        required: false,
        include: [{ model: Institution, as: 'institution' }],
      },
      {
        model: User,
        as: 'attestingWitness',
        required: false,
        include: [{ model: Institution, as: 'institution' }],
      },
      {
        model: CourtDocument,
        as: 'filedDocuments',
        required: false,
        order: [['documentOrder', 'ASC']],
        separate: true,
      },
      {
        model: CourtDocument,
        as: 'mergedFiledDocuments',
        required: false,
        order: [['mergedDocumentOrder', 'ASC']],
        separate: true,
      },
      {
        model: CourtSessionString,
        as: 'courtSessionStrings',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CourtDocument,
    as: 'unfiledCourtDocuments',
    required: false,
    order: [
      ['documentOrder', 'DESC'],
      ['created', 'ASC'],
    ],
    where: { courtSessionId: null },
    separate: true,
  },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    order: [['created', 'DESC']],
    where: { state: { [Op.not]: CaseFileState.DELETED } },
    separate: true,
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: { eventType: eventTypes },
    separate: true,
  },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: CaseString,
    as: 'caseStrings',
    required: false,
    where: { stringType: stringTypes },
    separate: true,
  },
  {
    model: Notification,
    as: 'notifications',
    required: false,
    where: { type: notificationTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: Case,
    as: 'mergeCase',
    include: [
      {
        model: CourtSession,
        as: 'courtSessions',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
  },
  {
    model: Case,
    as: 'mergedCases',
    where: { state: completedIndictmentCaseStates },
    include: [
      {
        model: Defendant,
        as: 'defendants',
        required: false,
        order: [['created', 'ASC']],
        include: [
          {
            model: Subpoena,
            as: 'subpoenas',
            required: false,
            order: [['created', 'DESC']],
            separate: true,
          },
          {
            model: Verdict,
            as: 'verdicts',
            required: false,
            order: [['created', 'DESC']],
            separate: true,
          },
        ],
        separate: true,
      },
      {
        model: CourtSession,
        as: 'courtSessions',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
        include: [
          {
            model: CourtDocument,
            as: 'filedDocuments',
            required: false,
            order: [['documentOrder', 'ASC']],
            separate: true,
          },
          {
            model: CourtDocument,
            as: 'mergedFiledDocuments',
            required: false,
            order: [['mergedDocumentOrder', 'ASC']],
            separate: true,
          },
          {
            model: CourtSessionString,
            as: 'courtSessionStrings',
            required: false,
            order: [['created', 'ASC']],
            separate: true,
          },
        ],
      },
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: {
          state: { [Op.not]: CaseFileState.DELETED },
          category: {
            [Op.in]: [
              CaseFileCategory.COURT_RECORD,
              CaseFileCategory.CRIMINAL_RECORD,
              CaseFileCategory.COST_BREAKDOWN,
              CaseFileCategory.CRIMINAL_RECORD_UPDATE,
              CaseFileCategory.CASE_FILE,
              CaseFileCategory.PROSECUTOR_CASE_FILE,
              CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIM,
            ],
          },
        },
        separate: true,
      },
      { model: Institution, as: 'court' },
      { model: User, as: 'judge' },
      { model: User, as: 'prosecutor' },
      { model: Institution, as: 'prosecutorsOffice' },
    ],
    separate: true,
  },
  {
    model: Case,
    as: 'splitCase',
    include: [{ model: User, as: 'judge' }],
  },
  {
    model: Case,
    as: 'splitCases',
    include: [
      {
        model: Defendant,
        as: 'defendants',
        required: false,
        order: [['created', 'ASC']],
        include: [
          {
            model: Subpoena,
            as: 'subpoenas',
            required: false,
            order: [['created', 'DESC']],
            separate: true,
          },
        ],
        separate: true,
      },
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: { state: { [Op.not]: CaseFileState.DELETED } },
        separate: true,
      },
    ],
    separate: true,
  },
]

interface UpdateDateLog {
  date?: Date
  location?: string
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
