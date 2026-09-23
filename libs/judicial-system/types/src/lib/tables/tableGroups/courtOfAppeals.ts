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

// Appealed indictment verdicts. Their own group rather than more tables in the
// one above: a verdict appeal is a different proceeding from a ruling appeal,
// and the two lists carry different columns. Routes are matched across every group, so
// these cannot reuse the routes above.
const courtOfAppealsVerdictAppealsTableGroup = {
  title: 'Áfrýjuð sakamál',
  tables: [
    {
      type: CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_IN_PROGRESS,
      route: 'afryjud-mal-i-vinnslu',
      title: 'Mál í vinnslu',
      description: 'Áfrýjuð sakamál.',
      includeCounter: true,
    },
    {
      type: CaseTableType.COURT_OF_APPEALS_VERDICT_APPEALS_COMPLETED,
      route: 'afryjud-afgreidd-mal',
      title: 'Afgreidd mál',
      description: 'Mál sem búið er að ljúka.',
    },
  ],
}

export const courtOfAppealsTableGroups: CaseTableGroup[] = [
  courtOfAppealsCasesTableGroup,
  courtOfAppealsVerdictAppealsTableGroup,
]
