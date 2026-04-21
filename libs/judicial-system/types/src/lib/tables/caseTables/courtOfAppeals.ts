import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const courtOfAppealsCasesInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
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
  'caseType',
  'appealState',
  'validFromTo',
]

export const courtOfAppealsCasesCompleted: CaseTable = {
  title: 'Afgreidd mál',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsCasesCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsCasesCompletedColumnKeys),
}
