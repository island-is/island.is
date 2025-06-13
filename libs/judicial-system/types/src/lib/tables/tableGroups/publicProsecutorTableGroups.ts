import {
  CaseTableGroup,
  CaseTableRoutes,
  CaseTableType,
} from '../caseTableTypes'
import {
  prosecutorIndictmentsTableGroup,
  prosecutorRequestCasesTableGroup,
} from './prosecutorTableGroups'

const publicProsecutorRequestCasesTableGroup: CaseTableGroup =
  prosecutorRequestCasesTableGroup

const publicProsecutorIndictmentsTableGroup: CaseTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_IN_REVIEW,
      route: CaseTableRoutes.IN_REVIEW,
      title: 'Þín mál til yfirlestrar',
      description: 'Dómar og viðurlagaákvarðanir.',
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTOR_INDICTMENT_REVIEWED,
      route: CaseTableRoutes.REVIEWED,
      title: 'Yfirlesin mál',
      description: 'Dómar og viðurlagaákvarðanir.',
    },
    ...prosecutorIndictmentsTableGroup.tables,
  ],
}

export const publicProsecutorTableGroups: CaseTableGroup[] = [
  publicProsecutorRequestCasesTableGroup,
  publicProsecutorIndictmentsTableGroup,
]
