import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const publicProsecutionOfficeIndictmentsTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW,
      route: 'ny-sakamal',
      title: 'Ný mál',
      description: 'Ný mál sem á eftir að úthluta í yfirlestur.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
      route: 'sakamal-i-yfirlestri',
      title: 'Mál í yfirlestri',
      description: 'Mál sem eru í yfirlestri hjá saksóknara.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED,
      route: 'yfirlesin-sakamal',
      title: 'Yfirlesin mál',
      description: 'Mál sem hafa verið lesin yfir og eru óbirt eða á fresti.',
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEAL_PERIOD_EXPIRED,
      route: 'frestur-lidinn-i-sakamalum',
      title: 'Frestur liðinn',
      description: 'Áfrýjunarfrestur liðinn.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_SENT_TO_PRISON_ADMIN,
      route: 'sakamal-i-fullnustu',
      title: 'Mál í fullnustu',
      description: 'Mál sem hafa verið send í fullnustu.',
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED,
      route: 'afryjud-sakamal',
      title: 'Áfrýjuð mál',
      description: 'Mál sem hefur verið áfrýjað.',
      includeCounter: true,
    },
  ],
}

export const publicProsecutionOfficeTableGroups: CaseTableGroup[] = [
  publicProsecutionOfficeIndictmentsTableGroup,
]
