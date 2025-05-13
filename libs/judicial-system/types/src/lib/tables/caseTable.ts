import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isPrisonAdminUser,
} from '../user'
import {
  CaseTableColumn,
  CaseTableColumnKey,
  CaseTableColumnMap,
  caseTableColumns,
} from './caseTableColumn'

export enum CaseTableType {
  COURT_OF_APPEALS_IN_PROGRESS = 'COURT_OF_APPEALS_IN_PROGRESS',
  COURT_OF_APPEALS_COMPLETED = 'COURT_OF_APPEALS_COMPLETED',
  FMST_ACTIVE = 'FMST_ACTIVE',
  FMST_DONE = 'FMST_DONE',
  FMST_INDICTMENT_SENT_TO_PRISON_ADMIN = 'FMST_INDICTMENT_SENT_TO_PRISON_ADMIN',
  FMST_INDICTMENT_REGISTERED_RULING = 'FMST_INDICTMENT_REGISTERED_RULING',
}

export const getCaseTableType = (
  user: InstitutionUser | undefined,
  route: string | undefined,
): CaseTableType | undefined => {
  if (isCourtOfAppealsUser(user)) {
    switch (route) {
      case 'mal-i-vinnslu':
        return CaseTableType.COURT_OF_APPEALS_IN_PROGRESS
      case 'afgreidd-mal':
        return CaseTableType.COURT_OF_APPEALS_COMPLETED
    }
  }

  if (isPrisonAdminUser(user)) {
    switch (route) {
      case 'virk-mal':
        return CaseTableType.FMST_ACTIVE
      case 'lokid':
        return CaseTableType.FMST_DONE
      case 'mal-til-fullnustu':
        return CaseTableType.FMST_INDICTMENT_SENT_TO_PRISON_ADMIN
      case 'skradir-domar':
        return CaseTableType.FMST_INDICTMENT_REGISTERED_RULING
    }
  }
}

interface CaseTable {
  title: string
  columnKeys: CaseTableColumnKey[]
  columns: CaseTableColumn[]
}

const pickColumns = (
  keys: CaseTableColumnKey[],
): CaseTableColumnMap[CaseTableColumnKey][] => {
  return keys.map((key) => caseTableColumns[key])
}

const courtOfAppealsInProgressColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'courtOfAppealsHead',
]
const courtOfAppealsInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  columnKeys: courtOfAppealsInProgressColumnKeys,
  columns: pickColumns(courtOfAppealsInProgressColumnKeys),
}

const courtOfAppealsCompletedColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'appealState',
  'validFromTo',
]
const courtOfAppealsCompleted: CaseTable = {
  title: 'Afgreidd mál',
  columnKeys: courtOfAppealsCompletedColumnKeys,
  columns: pickColumns(courtOfAppealsCompletedColumnKeys),
}

const fmstActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'restrictionCaseState',
  'validFromTo',
]

const fmstActive: CaseTable = {
  title: 'Virk mál',
  columnKeys: fmstActiveColumnKeys,
  columns: pickColumns(fmstActiveColumnKeys),
}

const fmstDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'restrictionCaseState',
  'validFromTo',
]

const fmstDone: CaseTable = {
  title: 'Lokið',
  columnKeys: fmstDoneColumnKeys,
  columns: pickColumns(fmstDoneColumnKeys),
}

const fmstIndictmentSentToPrisonAdminColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'fmstReceivalDate',
  'fmstState',
]

const fmstIndictmentSentToPrisonAdmin: CaseTable = {
  title: 'Mál til fullnustu',
  columnKeys: fmstIndictmentSentToPrisonAdminColumnKeys,
  columns: pickColumns(fmstIndictmentSentToPrisonAdminColumnKeys),
}

const fmstIndictmentRegisteredRulingColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'fmstReceivalDate',
  'fmstState',
]

const fmstIndictmentRegisteredRuling: CaseTable = {
  title: 'Skráðir dómar',
  columnKeys: fmstIndictmentRegisteredRulingColumnKeys,
  columns: pickColumns(fmstIndictmentRegisteredRulingColumnKeys),
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppealsInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppealsCompleted,
  FMST_ACTIVE: fmstActive,
  FMST_DONE: fmstDone,
  FMST_INDICTMENT_SENT_TO_PRISON_ADMIN: fmstIndictmentSentToPrisonAdmin,
  FMST_INDICTMENT_REGISTERED_RULING: fmstIndictmentRegisteredRuling,
}
