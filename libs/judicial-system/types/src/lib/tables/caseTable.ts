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
  PRISON_ACTIVE = 'PRISON_ACTIVE',
  PRISON_DONE = 'PRISON_DONE',
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
        return CaseTableType.PRISON_ACTIVE
      case 'lokid':
        return CaseTableType.PRISON_DONE
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
  title: 'Mál í vinnslu',
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
  columnKeys: districtCourtRequestCasesCompletedColumnKeys,
  columns: pickColumns(districtCourtRequestCasesCompletedColumnKeys),
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
  columnKeys: courtOfAppealsCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsCompletedColumnKeys),
}

const prisonAdminActiveColumnKeys: CaseTableColumnKey[] = [
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
  columnKeys: prisonAdminActiveColumnKeys,
  columns: pickColumns(prisonAdminActiveColumnKeys),
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

const prisonDone: CaseTable = {
  title: 'Lokið',
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
  columnKeys: prosecutorsOfficeIndictmentReviewedColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentReviewedColumnKeys),
}

const prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType']
const prosecutorsOfficeIndictmentAppealPeriodExpired: CaseTable = {
  title: 'Frestur liðinn',
  columnKeys: prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys,
  columns: pickColumns(
    prosecutorsOfficeIndictmentAppealPeriodExpiredColumnKeys,
  ),
}

const prosecutorsOfficeIndictmentSentToPrisonAdminColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType', 'sentToPrisonAdminDate']

const prosecutorsOfficeIndictmentSentToPrisonAdmin: CaseTable = {
  title: 'Mál í fullnustu',
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
  columnKeys: prosecutorsOfficeIndictmentAppealedColumnKeys,
  columns: pickColumns(prosecutorsOfficeIndictmentAppealedColumnKeys),
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppealsInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppealsCompleted,
  DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS: districtCourtRequestCasesInProgress,
  DISTRICT_COURT_REQUEST_CASES_APPEALED: districtCourtRequestCasesAppealed,
  DISTRICT_COURT_REQUEST_CASES_COMPLETED: districtCourtRequestCasesCompleted,
  PRISON_ACTIVE: prisonActive,
  PRISON_DONE: prisonDone,
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
