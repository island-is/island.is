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
      includeCounter: true,
    },
    // Every prosecutor at the office sees every appealed verdict, not only the
    // ones they read over themselves - an appeal can land with a prosecutor who
    // had nothing to do with the review.
    {
      type: CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_APPEALED,
      route: 'afryjud-sakamal',
      title: 'Áfrýjuð mál',
      description: 'Mál sem hefur verið áfrýjað.',
      includeCounter: true,
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
