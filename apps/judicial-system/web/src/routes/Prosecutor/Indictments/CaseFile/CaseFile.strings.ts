import { defineMessage } from 'react-intl'

export const caseFile = {
  heading: defineMessage({
    id: 'judicial.system.core:case_file.heading',
    defaultMessage: 'Skjalaskrá',
    description: 'Notaður sem titill á skjalaskrá skrefi í ákærum.',
  }),
  infoPanel: defineMessage({
    id: 'judicial.system.core:case_file.info_panel',
    defaultMessage:
      'Hér er hægt að útbúa gagnapakka með skjalaskrá fyrir hvert málsnúmer. Hægt er að raða skjölum í rétta röð, breyta heiti skjala og dagsetningum í efnisyfirliti.',
    description: 'Texti í upplýsingarboxi á skjalaskrá skrefi í ákærum.',
  }),
  accordionTitle: defineMessage({
    id: 'judicial.system.core:case_file.accordion_title',
    defaultMessage: 'Gögn úr LÖKE máli {policeCaseNumber}',
    description:
      'Notaður sem titill á fellilista í skjalaskrá skrefi í ákærum.',
  }),
}
