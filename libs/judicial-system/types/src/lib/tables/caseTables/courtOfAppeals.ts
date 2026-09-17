import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const courtOfAppealsCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'appealCaseType',
  'appealState',
  'courtOfAppealsHead',
]

export const courtOfAppealsCasesInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsCasesInProgressColumnKeys,
  columns: pickColumns(courtOfAppealsCasesInProgressColumnKeys),
}

const courtOfAppealsCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'appealCaseType',
  'appealState',
  'validFromTo',
]

export const courtOfAppealsCasesCompleted: CaseTable = {
  title: 'Afgreidd mál',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsCasesCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsCasesCompletedColumnKeys),
}

// Appealed indictment verdicts. A verdict appeal reaches this list as soon as it
// is filed, before the court of appeals has received it, so the first thing the
// court sees is a case with no appeal case number - "Nýtt".
const courtOfAppealsVerdictAppealsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'districtCourtRulingDate',
  'verdictAppealAppellant',
  'verdictAppealState',
  'verdictAppealHead',
]

export const courtOfAppealsVerdictAppealsInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsVerdictAppealsInProgressColumnKeys,
  columns: pickColumns(courtOfAppealsVerdictAppealsInProgressColumnKeys),
}

const courtOfAppealsVerdictAppealsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'verdictAppealAppellant',
  'verdictAppealCompletedDate',
  'verdictAppealResult',
]

export const courtOfAppealsVerdictAppealsCompleted: CaseTable = {
  title: 'Afgreidd mál',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsVerdictAppealsCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsVerdictAppealsCompletedColumnKeys),
}
