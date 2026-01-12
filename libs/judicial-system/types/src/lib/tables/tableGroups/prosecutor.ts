import { CaseTableGroup, CaseTableType } from '../caseTableTypes'

export const prosecutorRequestCasesTableGroup: CaseTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS,
      route: 'rannsoknarmal-i-vinnslu',
      title: 'Rannsóknarmál í vinnslu',
      description: 'Drög, send mál, móttekin mál og mál á dagskrá.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_REQUEST_CASES_ACTIVE,
      route: 'virk-rannsoknarmal',
      title: 'Virk mál',
      description: 'Virk gæsluvarðhöld, farbönn og vistanir.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_REQUEST_CASES_APPEALED,
      route: 'rannsoknarmal-i-kaeuferli',
      title: 'Mál í kæruferli',
      description: 'Úrskurðir sem eru í kæruferli hjá Landsrétti.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_REQUEST_CASES_COMPLETED,
      route: 'afgreidd-rannsoknarmal',
      title: 'Afgreidd rannsóknarmál',
      description: 'Rannsóknarmál sem búið er að ljúka.',
    },
  ],
}

export const prosecutorIndictmentsTableGroup: CaseTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PROSECUTION_INDICTMENTS_IN_DRAFT,
      route: 'sakamal-i-drogum',
      title: 'Ákærur í drögum',
      description: 'Ákærur í drögum.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_INDICTMENTS_WAITING_FOR_CONFIRMATION,
      route: 'sakamal-sem-bida-stadfestingar',
      title: 'Ákærur sem bíða staðfestingar',
      description: 'Ákærur sem á eftir að staðfesta og senda til héraðsdóms.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_INDICTMENTS_IN_PROGRESS,
      route: 'sakamal-i-vinnslu',
      title: 'Sakamál í vinnslu',
      description: 'Sakamál sem eru í vinnslu.',
      includeCounter: true,
    },
    {
      type: CaseTableType.PROSECUTION_INDICTMENTS_COMPLETED,
      route: 'afgreidd-sakamal',
      title: 'Afgreidd sakamál',
      description: 'Sakamál sem búið er að ljúka.',
    },
  ],
}

export const prosecutorTableGroups: CaseTableGroup[] = [
  prosecutorRequestCasesTableGroup,
  prosecutorIndictmentsTableGroup,
]
