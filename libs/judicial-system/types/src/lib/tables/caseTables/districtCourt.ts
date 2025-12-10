import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const districtCourtRequestCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'caseSentToCourtDate',
  'requestCaseState',
  'arraignmentDate',
]

export const districtCourtRequestCasesInProgress: CaseTable = {
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

export const districtCourtRequestCasesAppealed: CaseTable = {
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

export const districtCourtRequestCasesCompleted: CaseTable = {
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

export const districtCourtIndictmentsNew: CaseTable = {
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

export const districtCourtIndictmentsReceived: CaseTable = {
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

export const districtCourtIndictmentsInProgress: CaseTable = {
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

export const districtCourtIndictmentsFinalizing: CaseTable = {
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

export const districtCourtIndictmentsCompleted: CaseTable = {
  title: 'Afgreidd sakamál',
  hasMyCasesFilter: true,
  columnKeys: districtCourtIndictmentsCompletedColumnKeys,
  columns: pickColumns(districtCourtIndictmentsCompletedColumnKeys),
}
