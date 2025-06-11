import {
  CaseTableGroup,
  CaseTableRoutes,
  CaseTableType,
} from '../caseTableTypes'

export const prosecutorRequestCasesTableGroup: CaseTableGroup = {
  title: 'Rannsóknarmál',
  tables: [
    {
      type: CaseTableType.PROSECUTOR_REQUEST_CASES_IN_PROGRESS,
      route: CaseTableRoutes.IN_PROGRESS,
      title: 'Rannsóknarmál í vinnslu',
      description: 'Drög, send mál, móttekin mál og mál á dagskrá.',
    },
    {
      type: CaseTableType.PROSECUTOR_REQUEST_CASES_ACTIVE,
      route: CaseTableRoutes.ACTIVE,
      title: 'Virk mál',
      description: 'Virk gæsluvarðhöld, farbönn og vistanir.',
    },
    {
      type: CaseTableType.PROSECUTOR_REQUEST_CASES_APPEALED,
      route: CaseTableRoutes.REQUEST_APPEALED,
      title: 'Mál í kæruferli',
      description: 'Úrskurðir sem eru í kæruferli hjá Landsrétti.',
    },
    {
      type: CaseTableType.PROSECUTOR_REQUEST_CASES_COMPLETED,
      route: CaseTableRoutes.COMPLETED,
      title: 'Afgreidd rannsóknarmál',
      description: 'Rannsóknarmál sem búið er að ljúka.',
    },
  ],
}

export const prosecutorIndictmentsTableGroup: CaseTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PROSECUTOR_INDICTMENT_IN_DRAFT,
      route: CaseTableRoutes.INDICTMENT_DRAFT,
      title: 'Ákærur í drögum',
      description: 'Ákærur í drögum.',
    },
    {
      type: CaseTableType.PROSECUTOR_INDICTMENT_WAITING_FOR_CONFIRMATION,
      route: CaseTableRoutes.WAITING_FOR_CONFIRMATION,
      title: 'Ákærur sem bíða staðfestingar',
      description: 'Ákærur sem á eftir að staðfesta og senda til héraðsdóms.',
    },
    {
      type: CaseTableType.PROSECUTOR_INDICTMENT_IN_PROGRESS,
      route: CaseTableRoutes.INDICTMENT_IN_PROGRESS,
      title: 'Sakamál í vinnslu',
      description: 'Sakamál sem eru í vinnslu.',
    },
    {
      type: CaseTableType.PROSECUTOR_INDICTMENT_COMPLETED,
      route: CaseTableRoutes.INDICTMENT_COMPLETED,
      title: 'Afgreidd sakamál',
      description: 'Sakamál sem búið er að ljúka.',
    },
  ],
}

export const prosecutorTableGroups: CaseTableGroup[] = [
  prosecutorRequestCasesTableGroup,
  prosecutorIndictmentsTableGroup,
]
