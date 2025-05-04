import { InstitutionUser, isCourtOfAppealsUser } from '../user'
import { CaseTableColumn, caseTableColumns } from './caseTableColumn'

export enum CaseTableType {
  COURT_OF_APPEALS_IN_PROGRESS = 'COURT_OF_APPEALS_IN_PROGRESS',
  COURT_OF_APPEALS_COMPLETED = 'COURT_OF_APPEALS_COMPLETED',
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
}

interface CaseTable {
  title: string
  columns: CaseTableColumn[]
}

type M = typeof caseTableColumns
type K = keyof M

const pickColumns = (keys: K[]): M[K][] => {
  return keys.map((key) => caseTableColumns[key])
}

const courtOfAppearlInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  columns: pickColumns([
    'caseNumber',
    'defendants',
    'caseType',
    'caseState',
    'courtOfAppealsHead',
  ]),
}
const courtOfAppearlCompleted: CaseTable = {
  title: 'Afgreidd mál',
  columns: pickColumns([
    'caseNumber',
    'defendants',
    'caseType',
    'caseState',
    'validFromTo',
  ]),
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppearlInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppearlCompleted,
}
