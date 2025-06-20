import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prisonRequestCasesColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonRequestCasesActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: false,
  columnKeys: prisonRequestCasesColumnKeys,
  columns: pickColumns(prisonRequestCasesColumnKeys),
}

const prisonRequestCasesDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonRequestCasesDone: CaseTable = {
  title: 'Lokið',
  hasMyCasesFilter: false,
  columnKeys: prisonRequestCasesDoneColumnKeys,
  columns: pickColumns(prisonRequestCasesDoneColumnKeys),
}
