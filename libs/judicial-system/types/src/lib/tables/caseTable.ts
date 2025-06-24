import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutionUser,
  isProsecutorRepresentativeUser,
  isPublicProsecutionOfficeUser,
} from '../user'
import { CaseTableColumnKey } from './caseTableColumnTypes'
import {
  prosecutorIndictmentCompleted,
  prosecutorIndictmentInDraft,
  prosecutorIndictmentInProgress,
  prosecutorIndictmentWaitingForConfirmation,
  prosecutorRequestCasesActive,
  prosecutorRequestCasesAppealed,
  prosecutorRequestCasesCompleted,
  prosecutorRequestCasesInProgress,
  publicProsecutorIndictmentInReview,
  publicProsecutorIndictmentReviewed,
} from './caseTables'
import {
  CaseTable,
  CaseTableRoutes,
  CaseTableType,
  pickColumns,
} from './caseTableTypes'

export const getCaseTableType = (
  user: InstitutionUser | undefined,
  route: string | undefined,
): CaseTableType | undefined => {
  if (isDistrictCourtUser(user)) {
    switch (route) {
      case CaseTableRoutes.IN_PROGRESS:
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS
      case CaseTableRoutes.REQUEST_APPEALED:
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED
      case CaseTableRoutes.COMPLETED:
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED
      case CaseTableRoutes.INDICTMENT_NEW:
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW
      case CaseTableRoutes.INDICTMENT_RECEIVED:
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED
      case CaseTableRoutes.INDICTMENT_IN_PROGRESS:
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS
      case CaseTableRoutes.INDICTMENT_FINALIZING:
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING
      case CaseTableRoutes.INDICTMENT_COMPLETED:
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED
    }
  }
  if (isCourtOfAppealsUser(user)) {
    switch (route) {
      case CaseTableRoutes.IN_PROGRESS:
        return CaseTableType.COURT_OF_APPEALS_IN_PROGRESS
      case CaseTableRoutes.COMPLETED:
        return CaseTableType.COURT_OF_APPEALS_COMPLETED
    }
  }

  if (isPrisonAdminUser(user)) {
    switch (route) {
      case CaseTableRoutes.ACTIVE:
        return CaseTableType.PRISON_ADMIN_ACTIVE
      case CaseTableRoutes.DONE:
        return CaseTableType.PRISON_ADMIN_DONE
      case CaseTableRoutes.SENT_TO_PRISON:
        return CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN
      case CaseTableRoutes.REGISTERED_RULING:
        return CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING
    }
  }

  if (isPrisonStaffUser(user)) {
    switch (route) {
      case CaseTableRoutes.ACTIVE:
        return CaseTableType.PRISON_ACTIVE
      case CaseTableRoutes.DONE:
        return CaseTableType.PRISON_DONE
    }
  }

  if (isPublicProsecutionOfficeUser(user)) {
    switch (route) {
      case CaseTableRoutes.NEW:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_NEW
      case CaseTableRoutes.IN_REVIEW:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW
      case CaseTableRoutes.REVIEWED:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED
      case CaseTableRoutes.APPEALED_EXPIRED:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED
      case CaseTableRoutes.IN_PRISON:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN
      case CaseTableRoutes.INDICTMENT_APPEALED:
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED
    }
  }

  if (isProsecutorRepresentativeUser(user)) {
    switch (route) {
      case CaseTableRoutes.INDICTMENT_DRAFT:
        return CaseTableType.PROSECUTOR_INDICTMENT_IN_DRAFT
      case CaseTableRoutes.WAITING_FOR_CONFIRMATION:
        return CaseTableType.PROSECUTOR_INDICTMENT_WAITING_FOR_CONFIRMATION
      case CaseTableRoutes.INDICTMENT_IN_PROGRESS:
        return CaseTableType.PROSECUTOR_INDICTMENT_IN_PROGRESS
      case CaseTableRoutes.INDICTMENT_COMPLETED:
        return CaseTableType.PROSECUTOR_INDICTMENT_COMPLETED
    }
  }

  if (isProsecutionUser(user)) {
    switch (route) {
      case CaseTableRoutes.IN_PROGRESS:
        return CaseTableType.PROSECUTOR_REQUEST_CASES_IN_PROGRESS
      case CaseTableRoutes.ACTIVE:
        return CaseTableType.PROSECUTOR_REQUEST_CASES_ACTIVE
      case CaseTableRoutes.REQUEST_APPEALED:
        return CaseTableType.PROSECUTOR_REQUEST_CASES_APPEALED
      case CaseTableRoutes.COMPLETED:
        return CaseTableType.PROSECUTOR_REQUEST_CASES_COMPLETED
      case CaseTableRoutes.IN_REVIEW:
        return CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_IN_REVIEW
      case CaseTableRoutes.REVIEWED:
        return CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_REVIEWED
      case CaseTableRoutes.INDICTMENT_DRAFT:
        return CaseTableType.PROSECUTOR_INDICTMENT_IN_DRAFT
      case CaseTableRoutes.WAITING_FOR_CONFIRMATION:
        return CaseTableType.PROSECUTOR_INDICTMENT_WAITING_FOR_CONFIRMATION
      case CaseTableRoutes.INDICTMENT_IN_PROGRESS:
        return CaseTableType.PROSECUTOR_INDICTMENT_IN_PROGRESS
      case CaseTableRoutes.INDICTMENT_COMPLETED:
        return CaseTableType.PROSECUTOR_INDICTMENT_COMPLETED
    }
  }
}

const districtCourtRequestCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'arraignmentDate',
]

const districtCourtRequestCasesInProgress: CaseTable = {
  title: 'Rannsóknarmál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: districtCourtRequestCasesInProgressColumnKeys,
  columns: pickColumns(districtCourtRequestCasesInProgressColumnKeys),
}

const districtCourtRequestCasesAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'validFromTo',
]
const districtCourtRequestCasesAppealed: CaseTable = {
  title: 'Kærur til Landsréttar',
  hasMyCasesFilter: true,
  columnKeys: districtCourtRequestCasesAppealedColumnKeys,
  columns: pickColumns(districtCourtRequestCasesAppealedColumnKeys),
}

const districtCourtRequestCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

const districtCourtRequestCasesCompleted: CaseTable = {
  title: 'Afgreidd rannsóknarmál',
  hasMyCasesFilter: true,
  columnKeys: districtCourtRequestCasesCompletedColumnKeys,
  columns: pickColumns(districtCourtRequestCasesCompletedColumnKeys),
}

const districtCourtIndictmentsNewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentCaseState',
]
const districtCourtIndictmentsNew: CaseTable = {
  title: 'Bíða úthlutunar',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsNewColumnKeys,
  columns: pickColumns(districtCourtIndictmentsNewColumnKeys),
}

const districtCourtIndictmentsReceivedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
]

const districtCourtIndictmentsReceived: CaseTable = {
  title: 'Móttekin sakamál',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsReceivedColumnKeys,
  columns: pickColumns(districtCourtIndictmentsReceivedColumnKeys),
}

const districtCourtIndictmentsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentCaseState',
  'indictmentArraignmentDate',
]

const districtCourtIndictmentsInProgress: CaseTable = {
  title: 'Sakamál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsInProgressColumnKeys,
  columns: pickColumns(districtCourtIndictmentsInProgressColumnKeys),
}
const districtCourtIndictmentsFinalizingColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]
const districtCourtIndictmentsFinalizing: CaseTable = {
  title: 'Sakamál í frágangi',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsFinalizingColumnKeys,
  columns: pickColumns(districtCourtIndictmentsFinalizingColumnKeys),
}
const districtCourtIndictmentsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]
const districtCourtIndictmentsCompleted: CaseTable = {
  title: 'Afgreidd sakamál',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsCompletedColumnKeys,
  columns: pickColumns(districtCourtIndictmentsCompletedColumnKeys),
}

const courtOfAppealsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'courtOfAppealsHead',
]

const courtOfAppealsInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsInProgressColumnKeys,
  columns: pickColumns(courtOfAppealsInProgressColumnKeys),
}

const courtOfAppealsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'validFromTo',
]
const courtOfAppealsCompleted: CaseTable = {
  title: 'Afgreidd mál',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsCompletedColumnKeys),
}

const prisonColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

const prisonActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: false,
  columnKeys: prisonColumnKeys,
  columns: pickColumns(prisonColumnKeys),
}

const prisonDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

const prisonDone: CaseTable = {
  title: 'Lokið',
  hasMyCasesFilter: false,
  columnKeys: prisonDoneColumnKeys,
  columns: pickColumns(prisonDoneColumnKeys),
}

const prisonAdminColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

const prisonAdminActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminColumnKeys,
  columns: pickColumns(prisonAdminColumnKeys),
}

const prisonAdminDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

const prisonAdminDone: CaseTable = {
  title: 'Lokið',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminDoneColumnKeys,
  columns: pickColumns(prisonAdminDoneColumnKeys),
}

const prisonAdminIndictmentSentToPrisonAdminColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'prisonAdminReceivalDate',
  'prisonAdminState',
]

const prisonAdminIndictmentSentToPrisonAdmin: CaseTable = {
  title: 'Mál til fullnustu',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminIndictmentSentToPrisonAdminColumnKeys,
  columns: pickColumns(prisonAdminIndictmentSentToPrisonAdminColumnKeys),
}

const prisonAdminIndictmentRegisteredRulingColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'prisonAdminReceivalDate',
  'prisonAdminState',
]

const prisonAdminIndictmentRegisteredRuling: CaseTable = {
  title: 'Skráðir dómar',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminIndictmentRegisteredRulingColumnKeys,
  columns: pickColumns(prisonAdminIndictmentRegisteredRulingColumnKeys),
}

const prosecutorsOfficeIndictmentNewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'indictmentAppealDeadline',
]
const prosecutorsOfficeIndictmentNew: CaseTable = {
  title: 'Ný mál',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentNewColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentNewColumnKeys),
}

const prosecutorsOfficeIndictmentInReviewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'subpoenaServiceState',
  'indictmentReviewer',
  'indictmentAppealDeadline',
]
const prosecutorsOfficeIndictmentInReview: CaseTable = {
  title: 'Mál í yfirlestri',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentInReviewColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentInReviewColumnKeys),
}

const prosecutorsOfficeIndictmentReviewedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'subpoenaServiceState',
]
const prosecutorsOfficeIndictmentReviewed: CaseTable = {
  title: 'Yfirlesin mál',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentReviewedColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentReviewedColumnKeys),
}

const prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType']
const prosecutorsOfficeIndictmentAppealPeriodExpired: CaseTable = {
  title: 'Frestur liðinn',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys,
  columns: pickColumns(
    prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys,
  ),
}

const prosecutorsOfficeIndictmentSentToPrisonAdminColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType', 'sentToPrisonAdminDate']

const prosecutorsOfficeIndictmentSentToPrisonAdmin: CaseTable = {
  title: 'Mál í fullnustu',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentSentToPrisonAdminColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentSentToPrisonAdminColumnKeys),
}

const prosecutorsOfficeIndictmentAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'indictmentReviewDecision',
  'subpoenaServiceState',
]
const prosecutorsOfficeIndictmentAppealed: CaseTable = {
  title: 'Áfrýjuð mál',
  hasMyCasesFilter: false,
  columnKeys: prosecutorsOfficeIndictmentAppealedColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentAppealedColumnKeys),
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppealsInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppealsCompleted,
  DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS: districtCourtRequestCasesInProgress,
  DISTRICT_COURT_REQUEST_CASES_APPEALED: districtCourtRequestCasesAppealed,
  DISTRICT_COURT_REQUEST_CASES_COMPLETED: districtCourtRequestCasesCompleted,
  DISTRICT_COURT_INDICTMENTS_NEW: districtCourtIndictmentsNew,
  DISTRICT_COURT_INDICTMENTS_RECEIVED: districtCourtIndictmentsReceived,
  DISTRICT_COURT_INDICTMENTS_IN_PROGRESS: districtCourtIndictmentsInProgress,
  DISTRICT_COURT_INDICTMENTS_FINALIZING: districtCourtIndictmentsFinalizing,
  DISTRICT_COURT_INDICTMENTS_COMPLETED: districtCourtIndictmentsCompleted,
  PRISON_ACTIVE: prisonActive,
  PRISON_DONE: prisonDone,
  PRISON_ADMIN_ACTIVE: prisonAdminActive,
  PRISON_ADMIN_DONE: prisonAdminDone,
  PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN:
    prisonAdminIndictmentSentToPrisonAdmin,
  PRISON_ADMIN_INDICTMENT_REGISTERED_RULING:
    prisonAdminIndictmentRegisteredRuling,
  PROSECUTORS_OFFICE_INDICTMENT_NEW: prosecutorsOfficeIndictmentNew,
  PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW: prosecutorsOfficeIndictmentInReview,
  PROSECUTORS_OFFICE_INDICTMENT_REVIEWED: prosecutorsOfficeIndictmentReviewed,
  PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED:
    prosecutorsOfficeIndictmentAppealPeriodExpired,
  PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN:
    prosecutorsOfficeIndictmentSentToPrisonAdmin,
  PROSECUTORS_OFFICE_INDICTMENT_APPEALED: prosecutorsOfficeIndictmentAppealed,
  PROSECUTOR_REQUEST_CASES_IN_PROGRESS: prosecutorRequestCasesInProgress,
  PROSECUTOR_REQUEST_CASES_ACTIVE: prosecutorRequestCasesActive,
  PROSECUTOR_REQUEST_CASES_APPEALED: prosecutorRequestCasesAppealed,
  PROSECUTOR_REQUEST_CASES_COMPLETED: prosecutorRequestCasesCompleted,
  PUBLIC_PROSECUTOR_INDICTMENT_IN_REVIEW: publicProsecutorIndictmentInReview,
  PUBLIC_PROSECUTOR_INDICTMENT_REVIEWED: publicProsecutorIndictmentReviewed,
  PROSECUTOR_INDICTMENT_IN_DRAFT: prosecutorIndictmentInDraft,
  PROSECUTOR_INDICTMENT_WAITING_FOR_CONFIRMATION:
    prosecutorIndictmentWaitingForConfirmation,
  PROSECUTOR_INDICTMENT_IN_PROGRESS: prosecutorIndictmentInProgress,
  PROSECUTOR_INDICTMENT_COMPLETED: prosecutorIndictmentCompleted,
}
