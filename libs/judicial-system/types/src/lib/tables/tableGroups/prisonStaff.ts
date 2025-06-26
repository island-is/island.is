import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const prisonStaffRequestCasesTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.PRISON_STAFF_REQUEST_CASES_ACTIVE,
      route: 'virk-rannsoknarmal',
      title: 'Virk mál',
      description: 'Virk gæsluvarðhöld.',
    },
    {
      type: CaseTableType.PRISON_STAFF_REQUEST_CASES_DONE,
      route: 'rannsoknarmal-sem-er-lokid',
      title: 'Lokið',
      description: 'Gæsluvarðhöld sem er lokið.',
    },
  ],
}

export const prisonStaffTableGroups: CaseTableGroup[] = [
  prisonStaffRequestCasesTableGroup,
]
