import { InstitutionUser, isCourtOfAppealsUser } from '../user'
import { CaseTableType } from './caseTable'

interface CaseTableDesctiptor {
  type: CaseTableType
  title: string
  description: string
}

interface CaseTableGroup {
  title: string
  tables: CaseTableDesctiptor[]
}

const courtOfAppealsTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.COURT_OF_APPEALS_IN_PROGRESS,
        title: 'Mál í vinnslu',
        description: 'Kærð sakamál sem eru til meðferðar.',
      },
      {
        type: CaseTableType.COURT_OF_APPEALS_COMPLETED,
        title: 'Afgreidd mál',
        description: 'Mál sem búið er að ljúka.',
      },
    ],
  },
]

export const getCaseTableGroups = (
  user: InstitutionUser | undefined,
): CaseTableGroup[] => {
  if (isCourtOfAppealsUser(user)) {
    return courtOfAppealsTableGroups
  }

  return []
}
