import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isPublicProsecutionOfficeUser,
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

const prisonSystemRequestCaseGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.PRISON_ACTIVE,
      route: 'virk-mal',
      title: 'Virk mál',
      description: 'Virk gæsluvarðhöld og farbönn.',
    },
    {
      type: CaseTableType.PRISON_DONE,
      route: 'lokid',
      title: 'Lokið',
      description: 'Gæsluvarðhöld og farbönn sem er lokið.',
    },
  ],
}

const prisonAdminTableGroups: CaseTableGroup[] = [
  prisonSystemRequestCaseGroup,
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

const prisonStaffTableGroups: CaseTableGroup[] = [prisonSystemRequestCaseGroup]

const publicProsecutorsOfficeTableGroups: CaseTableGroup[] = [
  {
    title: 'Sakamál',
    tables: [
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_NEW,
        route: 'ny-mal',
        title: 'Ný mál',
        description: 'Ný mál sem á eftir að úthluta í yfirlestur.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW,
        route: 'mal-i-yfirlestri',
        title: 'Mál í yfirlestri',
        description: 'Mál sem eru í yfirlestri hjá saksóknara.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED,
        route: 'yfirlesin-mal',
        title: 'Yfirlesin mál',
        description: 'Mál sem hafa verið lesin yfir og eru óbirt eða á fresti.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED,
        route: 'frestur-lidinn',
        title: 'Frestur liðinn',
        description: 'Áfrýjunarfrestur liðinn.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN,
        route: 'mal-i-fullnustu',
        title: 'Mál í fullnustu',
        description: 'Mál sem hafa verið send í fullnustu.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED,
        route: 'afryjud-mal',
        title: 'Áfrýjuð mál',
        description: 'Mál sem hefur verið áfrýjað.',
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

  if (isPrisonStaffUser(user)) {
    return prisonStaffTableGroups
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return publicProsecutorsOfficeTableGroups
  }

  return []
}
