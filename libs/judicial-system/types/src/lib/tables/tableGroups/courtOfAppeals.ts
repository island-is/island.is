import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const courtOfAppealsRequestCasesTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_IN_PROGRESS,
      route: 'rannsoknarmal-i-vinnslu',
      title: 'Rannsóknarmál í vinnslu',
      description: 'Kærð sakamál sem eru til meðferðar.',
      includeCounter: true,
    },
    {
      type: CaseTableType.COURT_OF_APPEALS_REQUEST_CASES_COMPLETED,
      route: 'afgreidd-rannsoknarmal',
      title: 'Afgreidd mál',
      description: 'Mál sem búið er að ljúka.',
    },
  ],
}

export const courtOfAppealsTableGroups: CaseTableGroup[] = [
  courtOfAppealsRequestCasesTableGroup,
]
