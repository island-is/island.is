import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

export const defenceRequestCasesTableGroup: CaseTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.DEFENCE_REQUEST_CASES_IN_PROGRESS,
      route: 'rannsoknarmal-i-vinnslu',
      title: 'Rannsóknarmál í vinnslu',
      description: 'Send mál, móttekin mál og mál á dagskrá.',
      includeCounter: true,
    },
    {
      type: CaseTableType.DEFENCE_REQUEST_CASES_APPEALED,
      route: 'rannsoknarmal-i-kaeruferli',
      title: 'Rannsóknarmál í kæruferli',
      description: 'Úrskurðir sem eru í kæruferli hjá Landsrétti.',
      includeCounter: true,
    },
    {
      type: CaseTableType.DEFENCE_REQUEST_CASES_COMPLETED,
      route: 'afgreidd-rannsoknarmal',
      title: 'Afgreidd rannsóknarmál',
      description: 'Rannsóknarmál sem búið er að ljúka.',
    },
  ],
}

export const defenceIndictmentsTableGroup: CaseTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.DEFENCE_INDICTMENTS_IN_PROGRESS,
      route: 'sakamal-i-vinnslu',
      title: 'Sakamál í vinnslu',
      description: 'Sakamál sem eru í vinnslu.',
      includeCounter: true,
    },
    {
      type: CaseTableType.DEFENCE_INDICTMENTS_APPEALED,
      route: 'sakamal-i-kaeruferli',
      title: 'Sakamál í kæruferli',
      description: 'Úrskurðir í sakamálum sem eru í kæruferli hjá Landsrétti.',
      includeCounter: true,
    },
    {
      type: CaseTableType.DEFENCE_INDICTMENTS_COMPLETED,
      route: 'afgreidd-sakamal',
      title: 'Afgreidd sakamál',
      description: 'Sakamál sem búið er að ljúka.',
    },
  ],
}

export const defenceTableGroups: CaseTableGroup[] = [
  defenceRequestCasesTableGroup,
  defenceIndictmentsTableGroup,
]
