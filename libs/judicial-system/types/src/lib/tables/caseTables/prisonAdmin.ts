import { CaseTableColumnKey } from '../caseTableColumnTypes'
import { CaseTable, pickColumns } from '../caseTableTypes'

const prisonAdminRequestCasesActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonAdminRequestCasesActive: CaseTable = {
  title: 'Virk mál',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminRequestCasesActiveColumnKeys,
  columns: pickColumns(prisonAdminRequestCasesActiveColumnKeys),
}

const prisonAdminRequestCasesDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'requestCaseState',
  'appealCaseState',
  'validFromTo',
]

export const prisonAdminRequestCasesDone: CaseTable = {
  title: 'Lokið',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminRequestCasesDoneColumnKeys,
  columns: pickColumns(prisonAdminRequestCasesDoneColumnKeys),
}

const prisonAdminIndictmentsSentToPrisonAdminColumnKeys: CaseTableColumnKey[] =
  [
    'caseNumber',
    'defendants',
    'rulingType',
    'punishmentType',
    'prisonAdminReceivalDate',
    'prisonAdminState',
  ]

export const prisonAdminIndictmentsSentToPrisonAdmin: CaseTable = {
  title: 'Mál til fullnustu',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminIndictmentsSentToPrisonAdminColumnKeys,
  columns: pickColumns(prisonAdminIndictmentsSentToPrisonAdminColumnKeys),
}

const prisonAdminIndictmentsRegisteredRulingColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'prisonAdminReceivalDate',
  'prisonAdminState',
]

export const prisonAdminIndictmentsRegisteredRuling: CaseTable = {
  title: 'Skráðir dómar',
  hasMyCasesFilter: false,
  columnKeys: prisonAdminIndictmentsRegisteredRulingColumnKeys,
  columns: pickColumns(prisonAdminIndictmentsRegisteredRulingColumnKeys),
}
