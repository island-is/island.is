import { defineMessage } from 'react-intl'

export const indictmentsCaseFilesAccordionItem = {
  title: defineMessage({
    id: 'judicial.system.core:case_files.accordion_item.title',
    defaultMessage: 'Gögn úr LÖKE máli {policeCaseNumber}',
    description:
      'Notaður sem titill á fellilista í skjalaskrá skrefi í ákærum.',
  }),
  noCaseFiles: defineMessage({
    id: 'judicial.system.core:case_files.accordion_item.no_case_files',
    defaultMessage: 'Engin skjöl fundust',
    description:
      'Notaður sem texti í fellilista í skjalaskrá skrefi í ákærum þegar engin skjöl eru hengd við LÖKE númer.',
  }),
}
