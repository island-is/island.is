import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const courtOfAppealsRequestCaseslsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'courtOfAppealsHead',
]

export const courtOfAppealsRequestCasesInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsRequestCaseslsInProgressColumnKeys,
  columns: pickColumns(courtOfAppealsRequestCaseslsInProgressColumnKeys),
}

const courtOfAppealsRequestCasesCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'validFromTo',
]

export const courtOfAppealsRequestCasesCompleted: CaseTable = {
  title: 'Afgreidd mál',
  hasMyCasesFilter: false,
  columnKeys: courtOfAppealsRequestCasesCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsRequestCasesCompletedColumnKeys),
}
