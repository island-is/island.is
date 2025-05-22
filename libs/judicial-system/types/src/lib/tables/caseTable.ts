import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
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
  PRISON_ACTIVE = 'PRISON_ACTIVE',
  PRISON_DONE = 'PRISON_DONE',
  PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN = 'PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN',
  PRISON_ADMIN_INDICTMENT_REGISTERED_RULING = 'PRISON_ADMIN_INDICTMENT_REGISTERED_RULING',
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
        return CaseTableType.PRISON_ACTIVE
      case 'lokid':
        return CaseTableType.PRISON_DONE
      case 'mal-til-fullnustu':
        return CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN
      case 'skradir-domar':
        return CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING
    }
  }

  if (isPrisonStaffUser(user)) {
    switch (route) {
      case 'virk-mal':
        return CaseTableType.PRISON_ACTIVE
      case 'lokid':
        return CaseTableType.PRISON_DONE
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

const prisonAdminActiveColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'restrictionCaseState',
  'validFromTo',
]

const prisonActive: CaseTable = {
  title: 'Virk mál',
  columnKeys: prisonAdminActiveColumnKeys,
  columns: pickColumns(prisonAdminActiveColumnKeys),
}

const prisonAdminDoneColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'caseType',
  'rulingDate',
  'restrictionCaseState',
  'validFromTo',
]

const prisonDone: CaseTable = {
  title: 'Lokið',
  columnKeys: prisonAdminDoneColumnKeys,
  columns: pickColumns(prisonAdminDoneColumnKeys),
}

const prisonAdminIndictmentSentToPrisonAdminColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'prisonAdminReceivalDate',
  'prisonAdminState',
]

const prisonAdminIndictmentSentToPrisonAdmin: CaseTable = {
  title: 'Mál til fullnustu',
  columnKeys: prisonAdminIndictmentSentToPrisonAdminColumnKeys,
  columns: pickColumns(prisonAdminIndictmentSentToPrisonAdminColumnKeys),
}

const prisonAdminIndictmentRegisteredRulingColumnKeys: CaseTableColumnKey[] = [
  'caseNumber',
  'defendants',
  'rulingType',
  'punishmentType',
  'prisonAdminReceivalDate',
  'prisonAdminState',
]

const prisonAdminIndictmentRegisteredRuling: CaseTable = {
  title: 'Skráðir dómar',
  columnKeys: prisonAdminIndictmentRegisteredRulingColumnKeys,
  columns: pickColumns(prisonAdminIndictmentRegisteredRulingColumnKeys),
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppealsInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppealsCompleted,
  PRISON_ACTIVE: prisonActive,
  PRISON_DONE: prisonDone,
  PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN:
    prisonAdminIndictmentSentToPrisonAdmin,
  PRISON_ADMIN_INDICTMENT_REGISTERED_RULING:
    prisonAdminIndictmentRegisteredRuling,
}
