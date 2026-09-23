import { col, Includeable, literal, Op, Order, WhereOptions } from 'sequelize'

import {
  appealEventTypes,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseState,
  completedIndictmentCaseStates,
  CourtSessionRulingType,
  DateType,
  dateTypes,
  defendantEventTypes,
  DefendantPlea,
  DefenderChoice,
  EventType,
  eventTypes,
  Gender,
  IndictmentCaseReviewDecision,
  investigationCases,
  PunishmentType,
  restrictionCases,
  stringTypes,
  SubpoenaType,
  trackedNotificationTypes,
} from '@island.is/judicial-system/types'

import { AppealCase } from '../models/appealCase.model'
import { AppealDecision } from '../models/appealDecision.model'
import { AppealEventLog } from '../models/appealEventLog.model'
import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumber } from '../models/caseDefendantPoliceCaseNumber.model'
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
import { UpdateDateLog } from '../services/dateLogRepository.service'

export const caseInclude: Includeable[] = [
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: AppealCase,
    as: 'appealCase',
    required: false,
    include: [
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
        model: AppealEventLog,
        as: 'appealEventLogs',
        required: false,
        where: { eventType: appealEventTypes },
        separate: true,
      },
    ],
  },
  {
    model: AppealCase,
    as: 'verdictAppealCase',
    required: false,
    include: [
      {
        model: AppealEventLog,
        as: 'appealEventLogs',
        required: false,
        where: { eventType: appealEventTypes },
        separate: true,
      },
    ],
  },
  {
    model: AppealCase,
    as: 'rulingOrderAppealCases',
    required: false,
    separate: true,
    include: [
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
        model: AppealEventLog,
        as: 'appealEventLogs',
        required: false,
        where: { eventType: appealEventTypes },
        separate: true,
      },
    ],
  },
  {
    model: AppealDecision,
    as: 'appealDecisions',
    required: false,
    separate: true,
  },
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
    as: 'indictmentReviewer',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'indictmentApprover',
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
        order: [
          ['orderWithinChapter', 'ASC NULLS LAST'],
          ['created', 'ASC'],
        ],
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
      {
        model: CaseDefendantPoliceCaseNumber,
        as: 'caseDefendantPoliceCaseNumbers',
        required: false,
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
    order: [
      ['displayOrder', 'ASC'],
      ['created', 'ASC'],
    ],
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
        model: CaseFile,
        as: 'rulingFile',
        required: false,
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
    order: [
      ['orderWithinChapter', 'ASC NULLS LAST'],
      ['created', 'ASC'],
    ],
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
    where: { type: trackedNotificationTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: Case,
    as: 'mergeCase',
    include: [
      {
        model: Defendant,
        as: 'defendants',
        attributes: ['id', 'defenderNationalId', 'isDefenderChoiceConfirmed'],
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
      {
        model: CivilClaimant,
        as: 'civilClaimants',
        attributes: [
          'id',
          'hasSpokesperson',
          'spokespersonNationalId',
          'isSpokespersonConfirmed',
        ],
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
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
        model: CivilClaimant,
        as: 'civilClaimants',
        attributes: [
          'id',
          'hasSpokesperson',
          'spokespersonNationalId',
          'isSpokespersonConfirmed',
        ],
        required: false,
        order: [['created', 'ASC']],
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
        separate: true,
        include: [
          {
            model: Subpoena,
            as: 'subpoenas',
            required: false,
            order: [['created', 'DESC']],
            separate: true,
            where: {
              created: {
                [Op.lt]: literal(
                  `(SELECT "created" FROM "case" WHERE "case"."id" = (SELECT "case_id" FROM "defendant" WHERE "defendant"."id" = "Subpoena"."defendant_id"))`,
                ),
              },
            },
          },
        ],
      },
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: {
          state: { [Op.not]: CaseFileState.DELETED },
          defendantId: { [Op.not]: null },
          category: {
            [Op.in]: [
              CaseFileCategory.CRIMINAL_RECORD,
              CaseFileCategory.COST_BREAKDOWN,
              CaseFileCategory.CASE_FILE,
              CaseFileCategory.PROSECUTOR_CASE_FILE,
              CaseFileCategory.DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIM,
              CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
            ],
          },
          created: { [Op.lt]: col('Case.created') },
        },
      },
    ],
    separate: true,
  },
]

// A case is archivable ninety days after it stopped being worked on - the
// window is measured by the database's own clock, so it does not depend on
// when the archiving job happens to run.
const archiveLifetime = literal('current_date - 90')

// Which cases have outlived their retention window: request and investigation
// cases that were deleted, ones that never got past the court, and ones whose
// ruling or custody period is ninety days behind us.
export const archivableCaseWhere: WhereOptions = {
  [Op.and]: [
    { isArchived: false },
    {
      [Op.or]: [
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            { state: CaseState.DELETED },
          ],
        },
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              state: [
                CaseState.NEW,
                CaseState.DRAFT,
                CaseState.SUBMITTED,
                CaseState.RECEIVED,
              ],
            },
            { created: { [Op.lt]: archiveLifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: restrictionCases },
            { state: [CaseState.REJECTED, CaseState.DISMISSED] },
            { ruling_date: { [Op.lt]: archiveLifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: restrictionCases },
            { state: CaseState.ACCEPTED },
            { valid_to_date: { [Op.lt]: archiveLifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: investigationCases },
            {
              state: [
                CaseState.ACCEPTED,
                CaseState.REJECTED,
                CaseState.DISMISSED,
              ],
            },
            { ruling_date: { [Op.lt]: archiveLifetime } },
          ],
        },
      ],
    },
  ],
}

// Everything the archive is built from: every model that carries an encrypted
// property is read here, because the same transaction writes the archive and
// clears those properties off the live rows.
export const archivableCaseInclude: Includeable[] = [
  { model: Defendant, as: 'defendants' },
  {
    model: IndictmentCount,
    as: 'indictmentCounts',
    include: [
      {
        model: Offense,
        as: 'offenses',
      },
    ],
  },
  { model: CaseFile, as: 'caseFiles' },
  { model: CaseString, as: 'caseStrings' },
  { model: AppealCase, as: 'appealCase' },
  { model: AppealDecision, as: 'appealDecisions' },
]

// The archived children are stored as arrays of property values carrying no ids
// of their own, so a child's position is its only identity - this order is the
// order they are written to the archive in, and the order any future restore
// would have to assume. Nothing in this codebase reads the archive back.
export const archivableCaseOrder: Order = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
  [{ model: IndictmentCount, as: 'indictmentCounts' }, 'displayOrder', 'ASC'],
  [{ model: IndictmentCount, as: 'indictmentCounts' }, 'created', 'ASC'],
  [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
  [{ model: CaseString, as: 'caseStrings' }, 'created', 'ASC'],
  [{ model: AppealDecision, as: 'appealDecisions' }, 'created', 'ASC'],
]

// A verdict appeal deadline is decided per defendant, from that defendant's
// verdicts and the events already filed against them. Only cases with a
// defendant who has a verdict are of interest, hence the required joins; the
// judge and their institution ride along for the notification that follows.
export const verdictAppealDeadlineCaseInclude: Includeable[] = [
  {
    model: User,
    as: 'judge',
    required: false,
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: Defendant,
    as: 'defendants',
    required: true,
    include: [
      {
        model: DefendantEventLog,
        as: 'eventLogs',
        required: false,
      },
      {
        model: Verdict,
        as: 'verdicts',
        required: true,
        separate: true,
        order: [['created', 'DESC']],
      },
    ],
  },
]

// The digital mailbox lists a defendant's indictment cases by their
// arraignment, so the date log is joined required and filtered down to it.
export const defendantIndictmentCaseListInclude: Includeable[] = [
  {
    model: Defendant,
    as: 'defendants',
  },
  {
    model: DateLog,
    as: 'dateLogs',
    where: {
      dateType: DateType.ARRAIGNMENT_DATE,
    },
    required: true,
  },
]

// One indictment case as the digital mailbox shows it to a defendant: the
// defendant's own subpoenas and verdicts, who is handling the case, its dates,
// the event that sent it to the public prosecutor, and the judgement text from
// the court session that delivered it.
export const defendantIndictmentCaseInclude: Includeable[] = [
  {
    model: Defendant,
    as: 'defendants',
    include: [
      {
        model: Subpoena,
        as: 'subpoenas',
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
  },
  { model: Institution, as: 'court' },
  { model: Institution, as: 'prosecutorsOffice' },
  { model: User, as: 'judge' },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: DateLog, as: 'dateLogs' },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    order: [['created', 'DESC']],
    separate: true,
    where: {
      event_type: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    },
  },
  {
    model: CourtSession,
    as: 'courtSessions',
    required: false,
    order: [['created', 'DESC']],
    separate: true,
    attributes: ['ruling'],
    where: {
      ruling_type: CourtSessionRulingType.JUDGEMENT,
    },
  },
]

// A case waiting for its indictment review: only the defendants no one has
// decided on yet, and the event that handed the case to the public prosecutor.
export const indictmentReviewCaseInclude: Includeable[] = [
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    order: [['created', 'DESC']],
    separate: true,
    where: {
      event_type: EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
    },
  },
  {
    model: Defendant,
    as: 'defendants',
    required: true,
    where: {
      indictmentReviewDecision: null,
    },
  },
]

// The case counts only need to know when an indictment was confirmed, so the
// event log is joined filtered down to that one event. The alias is spelled out
// on every association here, as caseInclude does - Sequelize infers it from the
// single Case-EventLog relation either way, but naming it keeps the graph
// readable and survives a second relation being added.
export const caseStatisticsInclude: Includeable[] = [
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    attributes: ['created', 'eventType'],
    where: { eventType: EventType.INDICTMENT_CONFIRMED },
  },
]

// A request case's export rows are derived from its event log, the
// institutions handling it, its court dates and its appeal.
export const requestCaseEventExportInclude: Includeable[] = [
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    attributes: ['created', 'eventType'],
  },
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: AppealCase,
    as: 'appealCase',
    required: false,
    include: [
      {
        model: AppealEventLog,
        as: 'appealEventLogs',
        required: false,
        attributes: ['eventType', 'userRole'],
        separate: true,
      },
    ],
  },
]

// An indictment case's export rows are derived from the same case-level graph
// as a request case, plus the charges it brings and what happened to each
// defendant - service of the subpoena, the defendant's own events and the
// verdicts against them.
export const indictmentCaseEventExportInclude: Includeable[] = [
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    attributes: ['created', 'eventType'],
  },
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
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
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
]

// The case columns a limited access user is allowed to see. Every read on
// this path is restricted to them, on the case itself and on the cases linked
// to it.
export const limitedAccessCaseAttributes: (keyof Case)[] = [
  'id',
  'created',
  'modified',
  'origin',
  'type',
  'indictmentSubtypes',
  'state',
  'policeCaseNumbers',
  'defenderName',
  'defenderNationalId',
  'defenderEmail',
  'defenderPhoneNumber',
  'requestSharedWithDefender',
  'courtId',
  'leadInvestigator',
  'requestedCustodyRestrictions',
  'prosecutorId',
  'courtCaseNumber',
  'courtEndTime',
  'decision',
  'validToDate',
  'isCustodyIsolation',
  'isolationToDate',
  'conclusion',
  'rulingDate',
  'rulingSignatureDate',
  'registrarId',
  'judgeId',
  'courtRecordSignatoryId',
  'courtRecordSignatureDate',
  'parentCaseId',
  'caseModifiedExplanation',
  'openedByDefender',
  'caseResentExplanation',
  'prosecutorsOfficeId',
  'indictmentDecision',
  'indictmentRulingDecision',
  'indictmentHash',
  'courtSessionType',
  'indictmentReviewerId',
  'hasCivilClaims',
  'isCompletedWithoutRuling',
  'isArraignmentSummonsSkipped',
  'rulingModifiedHistory',
  'withCourtSessions',
]

const linkedCaseDefendantAccessAttributes: (keyof Defendant)[] = [
  'id',
  'defenderNationalId',
  'isDefenderChoiceConfirmed',
]

const mergedCaseDefendantAttributes: (keyof Defendant)[] = [
  ...linkedCaseDefendantAccessAttributes,
  'isSentToPrisonAdmin',
]

const linkedCaseCivilClaimantAccessAttributes: (keyof CivilClaimant)[] = [
  'id',
  'hasSpokesperson',
  'spokespersonNationalId',
  'isSpokespersonConfirmed',
]

const normalizeNationalId = (nationalId: string): string =>
  nationalId.replace(/-/g, '')

const getLinkedCaseDefendantsInclude = (
  defenderNationalId?: string,
): Includeable => ({
  model: Defendant,
  as: 'defendants',
  attributes: linkedCaseDefendantAccessAttributes,
  required: false,
  order: [['created', 'ASC']],
  ...(defenderNationalId
    ? {
        where: {
          defenderNationalId,
          isDefenderChoiceConfirmed: true,
        },
      }
    : {}),
})

const getMergedCaseDefendantsInclude = (
  defenderNationalId?: string,
): Includeable => ({
  model: Defendant,
  as: 'defendants',
  attributes: mergedCaseDefendantAttributes,
  required: false,
  order: [['created', 'ASC']],
  separate: true,
  ...(defenderNationalId
    ? {
        where: {
          defenderNationalId,
          isDefenderChoiceConfirmed: true,
        },
      }
    : {}),
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
      model: CaseDefendantPoliceCaseNumber,
      as: 'caseDefendantPoliceCaseNumbers',
      required: false,
      separate: true,
    },
  ],
})

const getLinkedCaseCivilClaimantsInclude = (
  defenderNationalId?: string,
  separate = false,
): Includeable => ({
  model: CivilClaimant,
  as: 'civilClaimants',
  attributes: linkedCaseCivilClaimantAccessAttributes,
  required: false,
  order: [['created', 'ASC']],
  ...(separate ? { separate: true } : {}),
  ...(defenderNationalId
    ? {
        where: {
          hasSpokesperson: true,
          spokespersonNationalId: defenderNationalId,
          isSpokespersonConfirmed: true,
        },
      }
    : {}),
})

// The case graph a limited access user is served. A defence user only ever
// sees the parties they act for on the cases linked to this one, so their
// national id - stored without a separator - narrows those joins; any other
// caller reads the links unfiltered.
export const getLimitedAccessCaseInclude = (
  defenceUserNationalId?: string,
): Includeable[] => {
  const defenderNationalId =
    defenceUserNationalId && normalizeNationalId(defenceUserNationalId)

  return [
    { model: Institution, as: 'prosecutorsOffice' },
    { model: Institution, as: 'court' },
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
      as: 'indictmentReviewer',
      include: [{ model: Institution, as: 'institution' }],
    },
    {
      model: User,
      as: 'indictmentApprover',
      include: [{ model: Institution, as: 'institution' }],
    },
    {
      model: AppealCase,
      as: 'appealCase',
      required: false,
      include: [
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
          model: AppealEventLog,
          as: 'appealEventLogs',
          required: false,
          where: { eventType: appealEventTypes },
          separate: true,
        },
      ],
    },
    {
      model: AppealCase,
      as: 'verdictAppealCase',
      required: false,
      include: [
        {
          model: AppealEventLog,
          as: 'appealEventLogs',
          required: false,
          where: { eventType: appealEventTypes },
          separate: true,
        },
      ],
    },
    {
      model: AppealCase,
      as: 'rulingOrderAppealCases',
      required: false,
      separate: true,
      include: [
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
          model: AppealEventLog,
          as: 'appealEventLogs',
          required: false,
          where: { eventType: appealEventTypes },
          separate: true,
        },
      ],
    },
    {
      model: AppealDecision,
      as: 'appealDecisions',
      required: false,
      separate: true,
    },
    { model: Case, as: 'parentCase', attributes: limitedAccessCaseAttributes },
    { model: Case, as: 'childCase', attributes: limitedAccessCaseAttributes },
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
        {
          model: DefendantEventLog,
          as: 'eventLogs',
          required: false,
          where: { eventType: defendantEventTypes },
          separate: true,
        },
        {
          model: CaseDefendantPoliceCaseNumber,
          as: 'caseDefendantPoliceCaseNumbers',
          required: false,
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
    {
      model: IndictmentCount,
      as: 'indictmentCounts',
      required: false,
      order: [
        ['displayOrder', 'ASC'],
        ['created', 'ASC'],
      ],
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
      model: CaseFile,
      as: 'caseFiles',
      required: false,
      order: [['created', 'DESC']],
      where: {
        state: { [Op.not]: CaseFileState.DELETED },
        category: [
          CaseFileCategory.RULING,
          CaseFileCategory.DEFENDANT_RULING,
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
          CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
          CaseFileCategory.APPEAL_RULING,
          CaseFileCategory.APPEAL_COURT_RECORD,
          CaseFileCategory.COURT_RECORD,
          CaseFileCategory.CRIMINAL_RECORD,
          CaseFileCategory.CRIMINAL_RECORD_UPDATE,
          CaseFileCategory.COST_BREAKDOWN,
          CaseFileCategory.CASE_FILE,
          CaseFileCategory.PROSECUTOR_CASE_FILE,
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
          CaseFileCategory.DEFENDANT_CASE_FILE,
          CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIM,
          CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
          CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        ],
      },
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
      model: Case,
      as: 'mergeCase',
      attributes: limitedAccessCaseAttributes,
      include: [
        getLinkedCaseDefendantsInclude(defenderNationalId),
        getLinkedCaseCivilClaimantsInclude(defenderNationalId),
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
      attributes: limitedAccessCaseAttributes,
      where: { state: completedIndictmentCaseStates },
      include: [
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
                CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
              ],
            },
          },
          separate: true,
        },
        getMergedCaseDefendantsInclude(defenderNationalId),
        getLinkedCaseCivilClaimantsInclude(defenderNationalId, true),
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
        { model: Institution, as: 'court' },
        { model: User, as: 'judge' },
        { model: Institution, as: 'prosecutorsOffice' },
      ],
      separate: true,
    },
    {
      model: Victim,
      as: 'victims',
      required: false,
      order: [['created', 'ASC']],
      separate: true,
    },
    {
      model: Case,
      as: 'splitCase',
      attributes: limitedAccessCaseAttributes,
    },
    {
      model: Case,
      as: 'splitCases',
      attributes: limitedAccessCaseAttributes,
      include: [
        {
          model: Defendant,
          as: 'defendants',
          required: false,
          order: [['created', 'ASC']],
          separate: true,
          include: [
            {
              model: Subpoena,
              as: 'subpoenas',
              required: false,
              order: [['created', 'DESC']],
              separate: true,
              where: {
                created: {
                  [Op.lt]: literal(
                    `(SELECT "created" FROM "case" WHERE "case"."id" = (SELECT "case_id" FROM "defendant" WHERE "defendant"."id" = "Subpoena"."defendant_id"))`,
                  ),
                },
              },
            },
          ],
        },
        {
          model: CaseFile,
          as: 'caseFiles',
          required: false,
          where: {
            state: { [Op.not]: CaseFileState.DELETED },
            defendantId: { [Op.not]: null },
            category: {
              [Op.in]: [
                CaseFileCategory.CRIMINAL_RECORD,
                CaseFileCategory.COST_BREAKDOWN,
                CaseFileCategory.CASE_FILE,
                CaseFileCategory.PROSECUTOR_CASE_FILE,
                CaseFileCategory.DEFENDANT_CASE_FILE,
                CaseFileCategory.CIVIL_CLAIM,
                CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
                CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
                CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
              ],
            },
            created: { [Op.lt]: col('Case.created') },
          },
        },
      ],
      separate: true,
    },
  ]
}

export interface UpdateCaseDefendantEventLogDecision {
  defendantId: string
  rulingDate?: Date
  rulingDecision: CaseIndictmentRulingDecision
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
    | 'caseModifiedExplanation'
    | 'rulingModifiedHistory'
    | 'caseResentExplanation'
    | 'crimeScenes'
    | 'indictmentIntroduction'
    | 'requestDriversLicenseSuspension'
    | 'creatingProsecutorId'
    | 'requestSharedWithDefender'
    | 'indictmentRulingDecision'
    | 'indictmentDecision'
    | 'courtSessionType'
    | 'mergeCaseId'
    | 'mergeCaseNumber'
    | 'isCompletedWithoutRuling'
    | 'isArraignmentSummonsSkipped'
    | 'hasCivilClaims'
    | 'isArchived'
  > {
  type?: Case['type']
  state?: Case['state']
  policeCaseNumbers?: Case['policeCaseNumbers']
  defendantWaivesRightToCounsel?: Case['defendantWaivesRightToCounsel'] | null
  courtEndTime?: Case['courtEndTime'] | null
  rulingDate?: Case['rulingDate'] | null
  courtCaseNumber?: Case['courtCaseNumber'] | null
  judgeId?: Case['judgeId'] | null
  registrarId?: Case['registrarId'] | null
  courtRecordSignatoryId?: Case['courtRecordSignatoryId'] | null
  courtRecordSignatureDate?: Case['courtRecordSignatureDate'] | null
  parentCaseId?: Case['parentCaseId'] | null
  indictmentReviewerId?: Case['indictmentReviewerId'] | null
  indictmentApproverId?: Case['indictmentApproverId'] | null
  indictmentDeniedExplanation?: Case['indictmentDeniedExplanation'] | null
  indictmentHash?: Case['indictmentHash'] | null
  rulingSignatureDate?: Case['rulingSignatureDate'] | null
  withCourtSessions?: Case['withCourtSessions']
  courtRecordHash?: Case['courtRecordHash'] | null
  arraignmentDate?: UpdateDateLog
  courtDate?: UpdateDateLog
  postponedIndefinitelyExplanation?: string
  civilDemands?: string
  penalties?: string
  defendantEventLogDecisions?: UpdateCaseDefendantEventLogDecision[]
  reopenReason?: string
  indictmentReviewReturnedExplanation?: string | null
}

export interface UpdateAppealCase
  extends Pick<
    AppealCase,
    | 'appealCaseNumber'
    | 'appealReceivedByCourtDate'
    | 'appealRulingDate'
    | 'appealAssistantId'
    | 'appealJudge1Id'
    | 'appealJudge2Id'
    | 'appealJudge3Id'
    | 'appealRulingDecision'
    | 'appealConclusion'
    | 'appealRulingModifiedHistory'
    | 'requestAppealRulingNotToBePublished'
    | 'appealValidToDate'
    | 'isAppealCustodyIsolation'
    | 'appealIsolationToDate'
    | 'rulingFileId'
    | 'appealDate'
  > {
  appealState?: AppealCase['appealState']
}

// An appeal case is created with its type and never changes it, so the type is
// required here and absent from UpdateAppealCase. That is what keeps a new
// creation path from quietly omitting it - the column's database default exists
// for old pods mid-rollout, not for application code to lean on.
export type CreateAppealCase = UpdateAppealCase & {
  appealType: AppealCase['appealType']
}

export interface UpdateDefendant {
  noNationalId?: boolean
  nationalId?: string
  dateOfBirth?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  defenderChoice?: DefenderChoice
  defendantPlea?: DefendantPlea
  subpoenaType?: SubpoenaType
  requestedDefenderChoice?: DefenderChoice
  requestedDefenderNationalId?: string
  requestedDefenderName?: string
  isDefenderChoiceConfirmed?: boolean
  caseFilesSharedWithDefender?: boolean
  appealDefenderName?: string | null
  appealDefenderNationalId?: string | null
  appealDefenderEmail?: string | null
  appealDefenderPhoneNumber?: string | null
  isAppealDefenderConfirmed?: boolean | null
  isSentToPrisonAdmin?: boolean
  punishmentType?: PunishmentType
  isAlternativeService?: boolean
  alternativeServiceDescription?: string
  indictmentReviewDecision?: IndictmentCaseReviewDecision | null
  publicProsecutorIsRegisteredInPoliceSystem?: boolean | null
  isDrivingLicenseSuspended?: boolean | null
  isClosedWithoutEnforcement?: boolean
}
