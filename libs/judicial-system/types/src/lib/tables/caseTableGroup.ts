import {
  InstitutionUser,
  isCourtOfAppealsUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutorRepresentativeUser,
  isProsecutorUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '../user'
import { prosecutorRepresentativeTableGroups } from './tableGroups/prosecutorRepresentativeTableGroups'
import { prosecutorTableGroups } from './tableGroups/prosecutorTableGroups'
import { publicProsecutorTableGroups } from './tableGroups/publicProsecutorTableGroups'
import {
  CaseTableGroup,
  CaseTableRoutes,
  CaseTableType,
} from './caseTableTypes'

const districtCourtTableGroups: CaseTableGroup[] = [
  {
    title: 'Rannsóknarmál',
    tables: [
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_IN_PROGRESS,
        route: CaseTableRoutes.IN_PROGRESS,
        title: 'Rannsóknarmál í vinnslu',
        description: 'Drög, ný mál, móttekin mál og mál á dagskrá.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_APPEALED,
        route: CaseTableRoutes.REQUEST_APPEALED,
        title: 'Kærur til Landsréttar',
        description:
          'Úrskurðir sem búið er að kæra en á eftir að senda til Landsréttar.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_REQUEST_CASES_COMPLETED,
        route: CaseTableRoutes.COMPLETED,
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
        route: CaseTableRoutes.INDICTMENT_NEW,
        title: 'Bíða úthlutunar',
        description: 'Ný sakamál sem á eftir að úthluta.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_RECEIVED,
        route: CaseTableRoutes.INDICTMENT_RECEIVED,
        title: 'Móttekin sakamál',
        description: 'Sakamál sem bíða þess að fyrirkall sé gefið út.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_IN_PROGRESS,
        route: CaseTableRoutes.INDICTMENT_IN_PROGRESS,
        title: 'Sakamál í vinnslu',
        description:
          'Sakamál sem eru í frestum, á dagskrá eða búið er að dómtaka.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_FINALIZING,
        route: CaseTableRoutes.INDICTMENT_FINALIZING,
        title: 'Sakamál í frágangi',
        description: 'Sakamál sem á eftir að senda til ríkissaksóknara.',
      },
      {
        type: CaseTableType.DISTRICT_COURT_INDICTMENTS_COMPLETED,
        route: CaseTableRoutes.INDICTMENT_COMPLETED,
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
        route: CaseTableRoutes.IN_PROGRESS,
        title: 'Rannsóknarmál í vinnslu',
        description: 'Kærð sakamál sem eru til meðferðar.',
      },
      {
        type: CaseTableType.COURT_OF_APPEALS_COMPLETED,
        route: CaseTableRoutes.COMPLETED,
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
        route: CaseTableRoutes.ACTIVE,
        title: 'Virk mál',
        description: 'Virk gæsluvarðhöld og farbönn.',
      },
      {
        type: CaseTableType.PRISON_ADMIN_DONE,
        route: CaseTableRoutes.DONE,
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
        route: CaseTableRoutes.SENT_TO_PRISON,
        title: 'Mál til fullnustu',
        description: 'Ný og móttekin mál.',
      },
      {
        type: CaseTableType.PRISON_ADMIN_INDICTMENT_REGISTERED_RULING,
        route: CaseTableRoutes.REGISTERED_RULING,
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
        route: CaseTableRoutes.ACTIVE,
        title: 'Virk mál',
        description: 'Virk gæsluvarðhöld.',
      },
      {
        type: CaseTableType.PRISON_DONE,
        route: CaseTableRoutes.DONE,
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
        route: CaseTableRoutes.NEW,
        title: 'Ný mál',
        description: 'Ný mál sem á eftir að úthluta í yfirlestur.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_IN_REVIEW,
        route: CaseTableRoutes.IN_REVIEW,
        title: 'Mál í yfirlestri',
        description: 'Mál sem eru í yfirlestri hjá saksóknara.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_REVIEWED,
        route: CaseTableRoutes.REVIEWED,
        title: 'Yfirlesin mál',
        description: 'Mál sem hafa verið lesin yfir og eru óbirt eða á fresti.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEAL_PERIOD_EXPIRED,
        route: CaseTableRoutes.APPEALED_EXPIRED,
        title: 'Frestur liðinn',
        description: 'Áfrýjunarfrestur liðinn.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_SENT_TO_PRISON_ADMIN,
        route: CaseTableRoutes.IN_PRISON,
        title: 'Mál í fullnustu',
        description: 'Mál sem hafa verið send í fullnustu.',
      },
      {
        type: CaseTableType.PROSECUTORS_OFFICE_INDICTMENT_APPEALED,
        route: CaseTableRoutes.INDICTMENT_APPEALED,
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

  if (isProsecutorRepresentativeUser(user)) {
    return prosecutorRepresentativeTableGroups
  }

  if (isProsecutorUser(user)) {
    return prosecutorTableGroups
  }

  return []
}
