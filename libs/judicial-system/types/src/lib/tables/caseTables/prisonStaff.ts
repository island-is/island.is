import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prisonStaffRequestCasesActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonStaffRequestCasesActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: false,
  columnKeys: prisonStaffRequestCasesActiveColumnKeys,
  columns: pickColumns(prisonStaffRequestCasesActiveColumnKeys),
}

const prisonStaffRequestCasesDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonStaffRequestCasesDone: CaseTable = {
  title: 'Lokið',
  hasMyCasesFilter: false,
  columnKeys: prisonStaffRequestCasesDoneColumnKeys,
  columns: pickColumns(prisonStaffRequestCasesDoneColumnKeys),
}
