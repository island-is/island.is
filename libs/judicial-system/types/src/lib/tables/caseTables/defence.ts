import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const defenceRequestCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'arraignmentDate',
]

export const defenceRequestCasesInProgress: CaseTable = {
  title: 'Rannsóknarmál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: defenceRequestCasesInProgressColumnKeys,
  columns: pickColumns(defenceRequestCasesInProgressColumnKeys),
}

const defenceRequestCasesAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const defenceRequestCasesAppealed: CaseTable = {
  title: 'Rannsóknarmál í kæruferli',
  hasMyCasesFilter: false,
  columnKeys: defenceRequestCasesAppealedColumnKeys,
  columns: pickColumns(defenceRequestCasesAppealedColumnKeys),
}

const defenceRequestCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const defenceRequestCasesCompleted: CaseTable = {
  title: 'Afgreidd rannsóknarmál',
  hasMyCasesFilter: false,
  columnKeys: defenceRequestCasesCompletedColumnKeys,
  columns: pickColumns(defenceRequestCasesCompletedColumnKeys),
}

const defenceIndictmentsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'indictmentCaseState',
  'indictmentArraignmentDate',
]

export const defenceIndictmentsInProgress: CaseTable = {
  title: 'Sakamál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: defenceIndictmentsInProgressColumnKeys,
  columns: pickColumns(defenceIndictmentsInProgressColumnKeys),
}

const defenceIndictmentsAppealedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'indictmentRulingDecisionWithoutAppealState',
  'appealCaseState',
]

export const defenceIndictmentsAppealed: CaseTable = {
  title: 'Sakamál í kæruferli',
  hasMyCasesFilter: false,
  columnKeys: defenceIndictmentsAppealedColumnKeys,
  columns: pickColumns(defenceIndictmentsAppealedColumnKeys),
}

const defenceIndictmentsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'indictmentRulingDecision',
]

export const defenceIndictmentsCompleted: CaseTable = {
  title: 'Afgreidd sakamál',
  hasMyCasesFilter: false,
  columnKeys: defenceIndictmentsCompletedColumnKeys,
  columns: pickColumns(defenceIndictmentsCompletedColumnKeys),
}
