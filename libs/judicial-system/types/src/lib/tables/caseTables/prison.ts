import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prisonRequestCasesActiveColumnKeys: CaseTableColumnKey[] = [
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
  columnKeys: prisonRequestCasesActiveColumnKeys,
  columns: pickColumns(prisonRequestCasesActiveColumnKeys),
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
