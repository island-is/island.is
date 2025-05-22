import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isPrisonAdminUser,
} from '../user'
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

const prisonAdminTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.PRISON_ADMIN_ACTIVE,
        route: 'virk-mal',
        title: 'Virk mál',
        description: 'Virk gæsluvarðhöld og farbönn.',
      },
      {
        type: CaseTableType.PRISON_ADMIN_DONE,
        route: 'lokid',
        title: 'Lokið',
        description: 'Lokin gæsluvarðhöld og farbönn.',
      },
    ],
  },
  {
    title: 'Sakamál',
    tables: [
      {
        type: CaseTableType.PRISON_ADMIN_INDICTMENT_SENT_TO_PRISON_ADMIN,
        route: 'mal-til-fullnustu',
        title: 'Mál til fullnustu',
        description: 'Ný og móttekin mál.',
      },
      {
        type: CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING,
        route: 'skradir-domar',
        title: 'Skráðir dómar',
        description: 'Mál sem hafa verið skráð',
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

  if (isPrisonAdminUser(user)) {
    return prisonAdminTableGroups
  }

  return []
}
