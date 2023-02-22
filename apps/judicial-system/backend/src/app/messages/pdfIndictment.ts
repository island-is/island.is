import { defineMessages } from '@formatjs/intl'

export const indictment = defineMessages({
  title: {
    id: 'judicial.system.backend:pdf.indictment.title',
    defaultMessage: 'ÁKÆRA',
    description: 'Notaður sem titill í ákæru PDF',
  },
  signature: {
    id: 'judicial.system.backend:pdf.indictment.signature',
    defaultMessage:
      '                    Skrifstofu {prosecutorsOfficeName}, {date}.',
    description: 'Notaður sem undirskrift í ákæru PDF',
  },
  tabTitle: {
    id: 'judicial.system.backend:pdf.indictment.tab_title',
    defaultMessage: 'Ákæra',
    description: 'Notaður sem titill á ákæru PDF flipa',
  },
})
