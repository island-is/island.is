import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const prisonAdminRequestCasesTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.PRISON_ADMIN_REQUEST_CASES_ACTIVE,
      route: 'virk-rannsoknarmal',
      title: 'Virk mál',
      description: 'Virk gæsluvarðhöld og farbönn.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PRISON_ADMIN_REQUEST_CASES_DONE,
      route: 'rannsoknarmal-sem-er-lokid',
      title: 'Lokið',
      description: 'Gæsluvarðhöld og farbönn sem er lokið.',
    },
  ],
}

const prisonAdminIndictmentsTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PRISON_ADMIN_INDICTMENTS_SENT_TO_PRISON_ADMIN,
      route: 'sakamal-til-fullnustu',
      title: 'Mál til fullnustu',
      description: 'Ný og móttekin mál.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PRISON_ADMIN_INDICTMENTS_REGISTERED_RULING,
      route: 'skradir-domar-i-sakamalum',
      title: 'Skráðir dómar',
      description: 'Mál sem hafa verið skráð.',
      includeCounter: true,
    },
  ],
}

export const prisonAdminTableGroups: CaseTableGroup[] = [
  prisonAdminRequestCasesTableGroup,
  prisonAdminIndictmentsTableGroup,
]
