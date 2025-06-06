import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '../user'
import { publicProsecutorTableGroups } from './tableGroups/publicProsecutorTableGroups'
import { CaseTableGroup, CaseTableType } from './caseTableTypes'

const districtCourtTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS,
        route: 'mal-i-vinnslu',
        title: 'Rannsóknarmál í vinnslu',
        description: 'Drög, ný mál, móttekin mál og mál á dagskrá.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED,
        route: 'kaerd-mal',
        title: 'Kærur til Landsréttar',
        description:
          'Úrskurðir sem búið er að kæra en á eftir að senda til Landsréttar.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED,
        route: 'afgreidd-mal',
        title: 'Afgreidd rannsóknarmál',
        description: 'Rannsóknarmál sem búið er að ljúka.',
      },
    ],
  },
  {
    title: 'Sakamál',
    tables: [
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_NEW,
        route: 'ny-sakamal',
        title: 'Bíða úthlutunar',
        description: 'Ný sakamál sem á eftir að úthluta.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED,
        route: 'mottekin-sakamal',
        title: 'Móttekin sakamál',
        description: 'Sakamál sem bíða þess að fyrirkall sé gefið út.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS,
        route: 'sakamal-i-vinnslu',
        title: 'Sakamál í vinnslu',
        description:
          'Sakamál sem eru í frestum, á dagskrá eða búið er að dómtaka.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING,
        route: 'sakamal-i-fragangi',
        title: 'Sakamál í frágangi',
        description: 'Sakamál sem á eftir að senda til ríkissaksóknara.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED,
        route: 'afgreidd-sakamal',
        title: 'Afgreidd sakamál',
        description: 'Sakamál sem búið er að ljúka.',
      },
    ],
  },
]

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
        description: 'Gæsluvarðhöld og farbönn sem er lokið.',
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
        description: 'Mál sem hafa verið skráð.',
      },
    ],
  },
]

const prisonStaffTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.PRISON_ACTIVE,
        route: 'virk-mal',
        title: 'Virk mál',
        description: 'Virk gæsluvarðhöld.',
      },
      {
        type: CaseTableType.PRISON_DONE,
        route: 'lokid',
        title: 'Lokið',
        description: 'Gæsluvarðhöld sem er lokið.',
      },
    ],
  },
]

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
  if (isDistrictCourtUser(user)) {
    return districtCourtTableGroups
  }
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

  if (isPublicProsecutionUser(user)) {
    return publicProsecutorTableGroups
  }

  return []
}
