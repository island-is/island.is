import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const publicProsecutionOfficeIndictmentsNewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'indictmentAppealDeadline',
]

export const publicProsecutionOfficeIndictmentsNew: CaseTable = {
  title: 'Ný mál',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionOfficeIndictmentsNewColumnKeys,
  columns: pickColumns(publicProsecutionOfficeIndictmentsNewColumnKeys),
}

const publicProsecutionOfficeIndictmentsInReviewColumnKeys: CaseTableColumnKey[] =
  [
    'caseNumber',
    'defendants',
    'rulingType',
    'subpoenaServiceState',
    'indictmentReviewer',
    'indictmentAppealDeadline',
  ]

export const publicProsecutionOfficeIndictmentsInReview: CaseTable = {
  title: 'Mál í yfirlestri',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionOfficeIndictmentsInReviewColumnKeys,
  columns: pickColumns(publicProsecutionOfficeIndictmentsInReviewColumnKeys),
}

const publicProsecutionOfficeIndictmentsReviewedColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType', 'subpoenaServiceState']

export const publicProsecutionOfficeIndictmentsReviewed: CaseTable = {
  title: 'Yfirlesin mál',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionOfficeIndictmentsReviewedColumnKeys,
  columns: pickColumns(publicProsecutionOfficeIndictmentsReviewedColumnKeys),
}

const publicProsecutionOfficeIndictmentsAppealPeriodExpiredColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType']

export const publicProsecutionOfficeIndictmentsAppealPeriodExpired: CaseTable =
  {
    title: 'Frestur liðinn',
    hasMyCasesFilter: false,
    columnKeys: publicProsecutionOfficeIndictmentsAppealPeriodExpiredColumnKeys,
    columns: pickColumns(
      publicProsecutionOfficeIndictmentsAppealPeriodExpiredColumnKeys,
    ),
  }

const publicProsecutionOfficeIndictmentsSentToPrisonAdminColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'rulingType', 'sentToPrisonAdminDate']

export const publicProsecutionOfficeIndictmentsSentToPrisonAdmin: CaseTable = {
  title: 'Mál í fullnustu',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionOfficeIndictmentsSentToPrisonAdminColumnKeys,
  columns: pickColumns(
    publicProsecutionOfficeIndictmentsSentToPrisonAdminColumnKeys,
  ),
}

const publicProsecutionOfficeIndictmentsAppealedColumnKeys: CaseTableColumnKey[] =
  [
    'caseNumber',
    'defendants',
    'rulingType',
    'indictmentReviewDecision',
    'subpoenaServiceState',
  ]

export const publicProsecutionOfficeIndictmentsAppealed: CaseTable = {
  title: 'Áfrýjuð mál',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionOfficeIndictmentsAppealedColumnKeys,
  columns: pickColumns(publicProsecutionOfficeIndictmentsAppealedColumnKeys),
}
