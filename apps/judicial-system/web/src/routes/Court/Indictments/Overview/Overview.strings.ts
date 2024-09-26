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
  serviceStatusSuccess: {
    id: 'judicial.system.core:indictment_overview.service_status_success',
    defaultMessage: 'Birting tókst',
    description: 'Notaður sem texti þegar birting tókst.',
  },
  serviceStatusExpired: {
    id: 'judicial.system.core:indictment_overview.service_status_expired',
    defaultMessage: 'Birting tókst ekki',
    description: 'Notaður sem texti þegar birting rann út á tíma.',
  },
  serviceStatusFailed: {
    id: 'judicial.system.core:indictment_overview.service_status_failed',
    defaultMessage: 'Árangurslaus birting',
    description: 'Notaður sem texti þegar birting tókst ekki.',
  },
  serviceStatusUnknown: {
    id: 'judicial.system.core:indictment_overview.service_status_unknown',
    defaultMessage: 'Birtingastaða óþekkt',
    description: 'Notaður sem texti þegar ekki er vitað um stöðu birtingar.',
  },
  servedToDefender: {
    id: 'judicial.system.core:indictment_overview.served_to_defender',
    defaultMessage: 'Birt fyrir verjanda - {lawyerName} {practice}',
    description: 'Notaður sem texti þegar birti var verjanda.',
  },
  servedToElectronically: {
    id: 'judicial.system.core:indictment_overview.served_electronically',
    defaultMessage: 'Rafrænt pósthólf island.is - {date}',
    description: 'Notaður sem texti þegar birti var í pósthólfi.',
  },
})
