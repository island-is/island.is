import { InstitutionUser, isCourtOfAppealsUser } from '../user'
import { CaseTableType } from './caseTable'

interface CaseTableDescriptor {
  type: CaseTableType
  route: string
  title: string
  description: string
}

interface CaseTableGroup {
  title: string
  tables: CaseTableDescriptor[]
}

const courtOfAppealsTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.COURT_OF_APPEALS_IN_PROGRESS,
        route: 'mal-i-vinnslu',
        title: 'Mál í vinnslu',
        description: 'Kærð sakamál sem eru til meðferðar.',
      },
      {
        type: CaseTableType.COURT_OF_APPEALS_COMPLETED,
        route: 'afgreidd-mal',
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
