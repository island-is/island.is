import { defineMessages } from '@formatjs/intl'

export const indictment = defineMessages({
  title: {
    id: 'judicial.system.backend:pdf.core.case_type.indictment',
    defaultMessage: 'ÁKÆRA',
    description: 'Notaður sem titill í ákæru PDF',
  },
  signature: {
    id: 'judicial.system.backend:pdf.core.signature',
    defaultMessage:
      '                    Skrifstofu {prosecutorsOfficeName}, {date}.',
    description: 'Notaður sem undirskrift í ákæru PDF',
  },
})
