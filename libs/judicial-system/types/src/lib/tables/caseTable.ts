import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isPublicProsecutionOfficeUser,
} from '../user'
import {
  CaseTableColumn,
  CaseTableColumnKey,
  CaseTableColumnMap,
  caseTableColumns,
} from './caseTableColumn'

export enum CaseTableType {
  COURT_OF_APPEALS_IN_PROGRESS = 'COURT_OF_APPEALS_IN_PROGRESS',
  COURT_OF_APPEALS_COMPLETED = 'COURT_OF_APPEALS_COMPLETED',
  DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS = 'DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS',
  DISTRICT_COURT_REQUEST_CASES_APPEALED = 'DISTRICT_COURT_REQUEST_CASES_APPEALED',
  DISTRICT_COURT_REQUEST_CASES_COMPLETED = 'DISTRICT_COURT_REQUEST_CASES_COMPLETED',
  DISTRICT_COURT_INDICTMENTS_NEW = 'DISTRICT_COURT_INDICTMENTS_NEW',
  DISTRICT_COURT_INDICTMENTS_RECEIVED = 'DISTRICT_COURT_INDICTMENTS_RECEIVED',
  DISTRICT_COURT_INDICTMENTS_IN_PROGRESS = 'DISTRICT_COURT_INDICTMENTS_IN_PROGRESS',
  DISTRICT_COURT_INDICTMENTS_FINALIZING = 'DISTRICT_COURT_INDICTMENTS_FINALIZING',
  DISTRICT_COURT_INDICTMENTS_COMPLETED = 'DISTRICT_COURT_INDICTMENTS_COMPLETED',
  PRISON_ACTIVE = 'PRISON_ACTIVE',
  PRISON_DONE = 'PRISON_DONE',
  PRISON_ADMIN_ACTIVE = 'PRISON_ADMIN_ACTIVE',
  PRISON_ADMIN_DONE = 'PRISON_ADMIN_DONE',
  PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN = 'PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN',
  PRISON_ADMIN_INDICTMENT_REGISTERED_RULING = 'PRISON_ADMIN_INDICTMENT_REGISTERED_RULING',
  PROSECUTORS_OFFICE_INDICTMENT_NEW = 'PROSECUTORS_OFFICE_INDICTMENT_NEW',
  PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW = 'PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW',
  PROSECUTORS_OFFICE_INDICTMENT_REVIEWED = 'PROSECUTORS_OFFICE_INDICTMENT_REVIEWED',
  PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED = 'PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED',
  PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN = 'PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN',
  PROSECUTORS_OFFICE_INDICTMENT_APPEALED = 'PROSECUTORS_OFFICE_INDICTMENT_APPEALED',
}

export const getCaseTableType = (
  user: InstitutionUser | undefined,
  route: string | undefined,
): CaseTableType | undefined => {
  if (isDistrictCourtUser(user)) {
    switch (route) {
      case 'mal-i-vinnslu':
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS
      case 'kaerd-mal':
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED
      case 'afgreidd-mal':
        return CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED
      case 'ny-sakamal':
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW
      case 'mottekin-sakamal':
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED
      case 'sakamal-i-vinnslu':
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS
      case 'sakamal-i-fragangi':
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING
      case 'afgreidd-sakamal':
        return CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED
    }
  }
  if (isCourtOfAppealsUser(user)) {
    switch (route) {
      case 'mal-i-vinnslu':
        return CaseTableType.COURT_OF_APPEALS_IN_PROGRESS
      case 'afgreidd-mal':
        return CaseTableType.COURT_OF_APPEALS_COMPLETED
    }
  }

  if (isPrisonAdminUser(user)) {
    switch (route) {
      case 'virk-mal':
        return CaseTableType.PRISON_ADMIN_ACTIVE
      case 'lokid':
        return CaseTableType.PRISON_ADMIN_DONE
      case 'mal-til-fullnustu':
        return CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN
      case 'skradir-domar':
        return CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING
    }
  }

  if (isPrisonStaffUser(user)) {
    switch (route) {
      case 'virk-mal':
        return CaseTableType.PRISON_ACTIVE
      case 'lokid':
        return CaseTableType.PRISON_DONE
    }
  }

  if (isPublicProsecutionOfficeUser(user)) {
    switch (route) {
      case 'ny-mal':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_NEW
      case 'mal-i-yfirlestri':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW
      case 'yfirlesin-mal':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED
      case 'frestur-lidinn':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED
      case 'mal-i-fullnustu':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN
      case 'afryjud-mal':
        return CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED
    }
  }
}

interface CaseTable {
  title: string
  hasMyCasesFilter: boolean
  columnKeys: CaseTableColumnKey[]
  columns: CaseTableColumn[]
}

const pickColumns = (
  keys: CaseTableColumnKey[],
): CaseTableColumnMap[CaseTableColumnKey][] => {
  return keys.map((key) => caseTableColumns[key])
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
}
