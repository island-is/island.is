import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prosecutionRequestCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'arraignmentDate',
]

export const prosecutionRequestCasesInProgress: CaseTable = {
  title: 'Rannsóknarmál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: prosecutionRequestCasesInProgressColumnKeys,
  columns: pickColumns(prosecutionRequestCasesInProgressColumnKeys),
}

const prosecutionRequestCasesActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'appealCaseState',
  'validFromTo',
]

export const prosecutionRequestCasesActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: true,
  columnKeys: prosecutionRequestCasesActiveColumnKeys,
  columns: pickColumns(prosecutionRequestCasesActiveColumnKeys),
}

const prosecutionRequestCasesAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prosecutionRequestCasesAppealed: CaseTable = {
  title: 'Mál í kæruferli',
  hasMyCasesFilter: true,
  columnKeys: prosecutionRequestCasesAppealedColumnKeys,
  columns: pickColumns(prosecutionRequestCasesAppealedColumnKeys),
}

const prosecutionRequestCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prosecutionRequestCasesCompleted: CaseTable = {
  title: 'Afgreidd rannsóknarmál',
  hasMyCasesFilter: true,
  columnKeys: prosecutionRequestCasesCompletedColumnKeys,
  columns: pickColumns(prosecutionRequestCasesCompletedColumnKeys),
}

const publicProsecutionIndictmentsInReviewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'indictmentAppealDeadline',
]

export const publicProsecutionIndictmentsInReview: CaseTable = {
  title: 'Þín mál til yfirlestrar',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionIndictmentsInReviewColumnKeys,
  columns: pickColumns(publicProsecutionIndictmentsInReviewColumnKeys),
}

const publicProsecutionIndictmentsReviewedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]

export const publicProsecutionIndictmentsReviewed: CaseTable = {
  title: 'Yfirlesin mál',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutionIndictmentsReviewedColumnKeys,
  columns: pickColumns(publicProsecutionIndictmentsReviewedColumnKeys),
}

const prosecutionIndictmentsInDraftColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'prosecutor',
  'created',
]

export const prosecutionIndictmentsInDraft: CaseTable = {
  title: 'Ákærur í drögum',
  hasMyCasesFilter: true,
  columnKeys: prosecutionIndictmentsInDraftColumnKeys,
  columns: pickColumns(prosecutionIndictmentsInDraftColumnKeys),
}

const prosecutionIndictmentsWaitingForConfirmationColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'caseType', 'created', 'prosecutor']

export const prosecutionIndictmentsWaitingForConfirmation: CaseTable = {
  title: 'Ákærur sem bíða staðfestingar',
  hasMyCasesFilter: true,
  columnKeys: prosecutionIndictmentsWaitingForConfirmationColumnKeys,
  columns: pickColumns(prosecutionIndictmentsWaitingForConfirmationColumnKeys),
}

const prosecutionIndictmentsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentCaseState',
  'indictmentArraignmentDate',
]

export const prosecutionIndictmentsInProgress: CaseTable = {
  title: 'Sakamál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: prosecutionIndictmentsInProgressColumnKeys,
  columns: pickColumns(prosecutionIndictmentsInProgressColumnKeys),
}

const prosecutionIndictmentsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]

export const prosecutionIndictmentsCompleted: CaseTable = {
  title: 'Afgreidd sakamál',
  hasMyCasesFilter: true,
  columnKeys: prosecutionIndictmentsCompletedColumnKeys,
  columns: pickColumns(prosecutionIndictmentsCompletedColumnKeys),
}
