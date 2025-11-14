import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  serviceStatusSuccess: {
    id: 'judicial.system.core:service_announcement.service_status_success',
    defaultMessage: 'Ákæra birt',
    description: 'Notaður sem texti þegar birting tókst.',
  },
  serviceStatusExpired: {
    id: 'judicial.system.core:service_announcement.service_status_expired',
    defaultMessage: 'Ákæra ekki birt',
    description: 'Notaður sem texti þegar birting rann út á tíma.',
  },
  serviceStatusExpiredMessage: {
    id: 'judicial.system.core:service_announcement.service_status_expired_message',
    defaultMessage: 'Ekki tókst að birta fyrir þingfestingu.',
    description: 'Notaður sem texti þegar birting rann út á tíma.',
  },
  serviceStatusFailed: {
    id: 'judicial.system.core:service_announcement.service_status_failed',
    defaultMessage: 'Árangurslaus birting',
    description: 'Notaður sem texti þegar birting tókst ekki.',
  },
  serviceStatusUnknown: {
    id: 'judicial.system.core:service_announcement.service_status_unknown',
    defaultMessage: 'Ákæra er í birtingarferli',
    description: 'Notaður sem texti þegar ekki er vitað um stöðu birtingar.',
  },
  servedToDefender: {
    id: 'judicial.system.core:service_announcement.served_to_defender',
    defaultMessage: 'Birt fyrir verjanda - {lawyerName} {practice}',
    description: 'Notaður sem texti þegar birt var verjanda.',
  },
  servedToElectronically: {
    id: 'judicial.system.core:service_announcement.served_electronically',
    defaultMessage: 'Rafrænt pósthólf island.is - {date}',
    description: 'Notaður sem texti þegar birt var í pósthólfi.',
  },
  subpoenaCreated: {
    id: 'judicial.system.core:service_announcement.subpoena_created',
    defaultMessage: 'Ákæra fór í birtingu {date}',
    description: 'Notaður sem texti þegar birt var í pósthólfi.',
  },
})
