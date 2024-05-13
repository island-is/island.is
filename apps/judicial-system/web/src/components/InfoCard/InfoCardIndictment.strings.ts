import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  indictmentCreated: {
    id: 'judicial.system.core:info_card_indictment.indictment_created',
    defaultMessage: 'Ákæra skráð',
    description:
      'Notaður sem titill á "dagsetningu ákæru" hluta af yfirliti ákæru.',
  },
  prosecutor: {
    id: 'judicial.system.core:info_card_indictment.prosecutor',
    defaultMessage: 'Ákærandi',
    description: 'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru.',
  },
  offence: {
    id: 'judicial.system.core:info_card_indictment.offence',
    defaultMessage: 'Brot',
    description: 'Notaður sem titill á "brot" hluta af yfirliti ákæru.',
  },
  indictmentReviewer: {
    id: 'judicial.system.core:info_card_indictment.indictment_reviewer',
    defaultMessage: 'Yfirlestur',
    description: 'Notaður sem titill á "yfirlestur" hluta af yfirliti ákæru.',
  },
})
