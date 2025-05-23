import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  inProgressTitle: {
    id: 'judicial.system.core:indictment_overview.in_progress_title',
    defaultMessage: 'Yfirlit ákæru',
    description:
      'Notaður sem titill á yfirliti ákæru þegar máli er ekki lokið.',
  },
  uploadFilesTitle: {
    id: 'judicial.system.core:indictment_overview.upload_files_title',
    defaultMessage: 'Gögn',
    description:
      'Notaður sem titill á yfirliti ákæru þar sem hægt er að hlaða upp gögnum.',
  },
  addFilesButtonText: {
    id: 'judicial.system.core:indictment_overview.add_files_button_text',
    defaultMessage: 'Bæta við gögnum',
    description:
      'Notaður sem texti á takka fyrir skref til að hlaða upp gögnum.',
  },
  returnIndictmentButtonText: {
    id: 'judicial.system.core:indictment_overview.return_indictment_button_text',
    defaultMessage: 'Endursenda',
    description: 'Notaður sem texti á takka til að endursenda ákæru.',
  },
  submitCourtFilesButtonText: {
    id: 'judicial.system.core:indictment_overview.send_court_files_button_text',
    defaultMessage: 'Senda gögn',
    description: 'Notaður sem texti á takka til að senda inn gögn.',
  },
})
