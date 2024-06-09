import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  inProgressTitle: {
    id: 'judicial.system.core:indictment_overview.in_progress_title',
    defaultMessage: 'Yfirlit ákæru',
    description:
      'Notaður sem titill á yfirliti ákæru þegar máli er ekki lokið.',
  },
  returnIndictmentButtonText: {
    id: 'judicial.system.core:indictment_overview.return_indictment_button_text',
    defaultMessage: 'Endursenda',
    description: 'Notaður sem texti á takka til að endursenda ákæru.',
  },
  scheduledInfoCardTitle: {
    id: 'judicial.system.core:indictment_overview.scheduled_info_card_title',
    defaultMessage: 'Á dagskrá',
    description: 'Notaður sem titill á Á dagskrá upplýsingakorti.',
  },
  scheduledInfoCardValue: {
    id: 'judicial.system.core:indictment_overview.scheduled_info_card_value',
    defaultMessage: 'Málið er dómtekið',
    description: 'Notaður sem gildi á Á dagskrá upplýsingakorti.',
  },
})
