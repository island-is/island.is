import { CaseTableGroup, CaseTableType } from '../caseTableTypes'
import {
  prosecutorIndictmentsTableGroup,
  prosecutorRequestCasesTableGroup,
} from './prosecutor'

const publicProsecutionRequestCasesTableGroup: CaseTableGroup =
  prosecutorRequestCasesTableGroup

const publicProsecutionIndictmentsTableGroup: CaseTableGroup = {
  title: 'Sakamál',
  tables: [
    {
      type: CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW,
      route: 'sakamal-til-yfirlestrar',
      title: 'Þín mál til yfirlestrar',
      description: 'Dómar og viðurlagaákvarðanir.',
    },
    {
      type: CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_REVIEWED,
      route: 'yfirlesin-sakamal',
      title: 'Yfirlesin mál',
      description: 'Dómar og viðurlagaákvarðanir.',
    },
    ...prosecutorIndictmentsTableGroup.tables,
  ],
}

export const publicProsecutionTableGroups: CaseTableGroup[] = [
  publicProsecutionRequestCasesTableGroup,
  publicProsecutionIndictmentsTableGroup,
]
