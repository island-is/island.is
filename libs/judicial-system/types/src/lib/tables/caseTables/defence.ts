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

// Verdict appeals, where the list above is about ruling appeals. The columns
// follow the appeal at the court of appeals rather than the district court
// case, so every appeal column reads the verdict appeal.
const defenceIndictmentsVerdictAppealedColumnKeys: CaseTableColumnKey[] = [
  'verdictAppealCaseNumber',
  'defendants',
  'caseType',
  'verdictAppealDate',
  'verdictAppealProgress',
  'verdictAppealCourtSession',
]

export const defenceIndictmentsVerdictAppealed: CaseTable = {
  title: 'Sakamál í áfrýjunarferli',
  hasMyCasesFilter: false,
  columnKeys: defenceIndictmentsVerdictAppealedColumnKeys,
  columns: pickColumns(defenceIndictmentsVerdictAppealedColumnKeys),
}

// A concluded case may have gone on to the court of appeals as a verdict
// appeal, and then its number there leads the case number cell, as it does for
// an appealed ruling.
const defenceIndictmentsCompletedColumnKeys: CaseTableColumnKey[] = [
  'latestAppealCaseNumber',
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
