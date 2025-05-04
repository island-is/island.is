import { InstitutionUser, isCourtOfAppealsUser } from '../user'
import {
  caseNumber,
  caseState,
  CaseTableColumn,
  caseType,
  courtOfAppealsHead,
  defendants,
  validFromTo,
} from './caseTableColumn'

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

const courtOfAppearlInProgress: CaseTable = {
  title: 'Mál í vinnslu',
  columns: [caseNumber, defendants, caseType, caseState, courtOfAppealsHead],
}
const courtOfAppearlCompleted: CaseTable = {
  title: 'Afgreidd mál',
  columns: [caseNumber, defendants, caseType, caseState, validFromTo],
}

export const caseTables: { [key in CaseTableType]: CaseTable } = {
  COURT_OF_APPEALS_IN_PROGRESS: courtOfAppearlInProgress,
  COURT_OF_APPEALS_COMPLETED: courtOfAppearlCompleted,
}
