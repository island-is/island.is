import { defineMessages } from 'react-intl'

export const infoCardActiveIndictment = defineMessages({
  indictmentCreated: {
    id: 'judicial.system.core:info_card_active_indictment.indictment_created',
    defaultMessage: 'Dagsetning ákæru',
    description:
      'Notaður sem titill á "dagsetningu ákæru" hluta af yfirliti ákæru.',
  },
  prosecutor: {
    id: 'judicial.system.core:info_card_active_indictment.prosecutor',
    defaultMessage: 'Ákærandi',
    description: 'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru.',
  },
  offence: {
    id: 'judicial.system.core:info_card_active_indictment.offence',
    defaultMessage: 'Brot',
    description: 'Notaður sem titill á "brot" hluta af yfirliti ákæru.',
  },
})
