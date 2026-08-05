import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

const courtOfAppealsCasesTableGroup = {
  title: 'Kærð sakamál',
  tables: [
    {
      type: CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
      route: 'mal-i-vinnslu',
      title: 'Mál í vinnslu',
      description: 'Kærðir úrskurðir í R-málum og S-málum.',
      includeCounter: true,
    },
    {
      type: CaseTableType.COURT_OF_APPEALS_CASES_COMPLETED,
      route: 'afgreidd-mal',
      title: 'Afgreidd mál',
      description: 'Mál sem búið er að ljúka.',
    },
  ],
}

export const courtOfAppealsTableGroups: CaseTableGroup[] = [
  courtOfAppealsCasesTableGroup,
]
