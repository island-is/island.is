import { defineMessage } from 'react-intl'

export const indictmentsCaseFilesAccordionItem = {
  title: defineMessage({
    id: 'judicial.system.core:case_files.accordion_item.title',
    defaultMessage: 'Gögn úr LÖKE máli {policeCaseNumber}',
    description:
      'Notaður sem titill á fellilista í skjalaskrá skrefi í ákærum.',
  }),
  explanation: defineMessage({
    id: 'judicial.system.core:case_files.accordion_item.explanation',
    defaultMessage:
      'Færðu hvert skjal undir réttan kafla í skjalaskránni og gefðu því lýsandi heiti.',
    description:
      'Notaður sem texti í fellilista í skjalaskrá skrefi í ákærum sem útskýrir hvernig gagnapakkinn virkar.',
  }),
  noCaseFiles: defineMessage({
    id: 'judicial.system.core:case_files.accordion_item.no_case_files',
    defaultMessage: 'Engin skjöl fundust',
    description:
      'Notaður sem texti í fellilista í skjalaskrá skrefi í ákærum þegar engin skjöl eru hengd við LÖKE númer.',
  }),
}
