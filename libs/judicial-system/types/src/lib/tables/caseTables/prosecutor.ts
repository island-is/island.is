import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prosecutorRequestCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'arraignmentDate',
]

export const prosecutorRequestCasesInProgress: CaseTable = {
  title: 'Rannsóknarmál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: prosecutorRequestCasesInProgressColumnKeys,
  columns: pickColumns(prosecutorRequestCasesInProgressColumnKeys),
}

const prosecutorRequestCasesActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'validFromTo',
]

export const prosecutorRequestCasesActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: true,
  columnKeys: prosecutorRequestCasesActiveColumnKeys,
  columns: pickColumns(prosecutorRequestCasesActiveColumnKeys),
}

const prosecutorRequestCasesAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prosecutorRequestCasesAppealed: CaseTable = {
  title: 'Mál í kæruferli',
  hasMyCasesFilter: true,
  columnKeys: prosecutorRequestCasesAppealedColumnKeys,
  columns: pickColumns(prosecutorRequestCasesAppealedColumnKeys),
}

const prosecutorRequestCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prosecutorRequestCasesCompleted: CaseTable = {
  title: 'Afgreidd rannsóknarmál',
  hasMyCasesFilter: true,
  columnKeys: prosecutorRequestCasesCompletedColumnKeys,
  columns: pickColumns(prosecutorRequestCasesCompletedColumnKeys),
}

const publicProsecutorIndictmentInReviewColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'indictmentAppealDeadline',
]

export const publicProsecutorIndictmentInReview: CaseTable = {
  title: 'Þín mál til yfirlestrar',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutorIndictmentInReviewColumnKeys,
  columns: pickColumns(publicProsecutorIndictmentInReviewColumnKeys),
}

const publicProsecutorIndictmentReviewedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]

export const publicProsecutorIndictmentReviewed: CaseTable = {
  title: 'Yfirlesin mál',
  hasMyCasesFilter: false,
  columnKeys: publicProsecutorIndictmentReviewedColumnKeys,
  columns: pickColumns(publicProsecutorIndictmentReviewedColumnKeys),
}

const prosecutorIndictmentInDraftColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'created',
]

export const prosecutorIndictmentInDraft: CaseTable = {
  title: 'Ákærur í drögum',
  hasMyCasesFilter: true,
  columnKeys: prosecutorIndictmentInDraftColumnKeys,
  columns: pickColumns(prosecutorIndictmentInDraftColumnKeys),
}

const prosecutorIndictmentWaitingForConfirmationColumnKeys: CaseTableColumnKey[] =
  ['caseNumber', 'defendants', 'caseType', 'created']

export const prosecutorIndictmentWaitingForConfirmation: CaseTable = {
  title: 'Ákærur sem bíða staðfestingar',
  hasMyCasesFilter: true,
  columnKeys: prosecutorIndictmentWaitingForConfirmationColumnKeys,
  columns: pickColumns(prosecutorIndictmentWaitingForConfirmationColumnKeys),
}

const prosecutorIndictmentInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentCaseState',
  'indictmentArraignmentDate',
]

export const prosecutorIndictmentInProgress: CaseTable = {
  title: 'Sakamál í vinnslu',
  hasMyCasesFilter: true,
  columnKeys: prosecutorIndictmentInProgressColumnKeys,
  columns: pickColumns(prosecutorIndictmentInProgressColumnKeys),
}

const prosecutorIndictmentCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentRulingDecision',
]

export const prosecutorIndictmentCompleted: CaseTable = {
  title: 'Afgreidd sakamál',
  hasMyCasesFilter: true,
  columnKeys: prosecutorIndictmentCompletedColumnKeys,
  columns: pickColumns(prosecutorIndictmentCompletedColumnKeys),
}
