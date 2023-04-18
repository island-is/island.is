import { defineMessages } from 'react-intl'

export const tables = defineMessages({
  caseNumber: {
    id: 'judicial.system.core:tables.case_number',
    defaultMessage: 'Málsnr.',
    description: 'Notaður sem titill fyrir málsnúmer dálk í lista yfir mál.',
  },
  type: {
    id: 'judicial.system.core:tables.type',
    defaultMessage: 'Tegund',
    description: 'Notaður sem titill fyrir tegund dálk í lista yfir mál.',
  },
  state: {
    id: 'judicial.system.core:tables.state',
    defaultMessage: 'Staða',
    description: 'Notaður sem titill fyrir staða dálk í lista yfir mál.',
  },
  newTag: {
    id: 'judicial.system.core:tables.new_tag',
    defaultMessage: 'Nýtt',
    description: 'Notað sem merki þegar mál í stöðu "Nýtt" í málalista',
  },
  receivedTag: {
    id: 'judicial.system.core:tables.received_tag',
    defaultMessage: 'Móttekið',
    description: 'Notað sem merki þegar mál í stöðu "Móttekið" í málalista',
  },
})
