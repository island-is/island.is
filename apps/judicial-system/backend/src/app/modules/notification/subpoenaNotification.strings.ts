import { defineMessage } from '@formatjs/intl'

export const strings = {
  serviceStatusUpdatedSubject: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_status_updated_subject',
    defaultMessage: 'Birting tókst í máli {courtCaseNumber}',
    description:
      'Subject of the notification sent when the serive status in an indictment has changed',
  }),
  serviceStatusUpdatedBody: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_status_updated_body',
    defaultMessage:
      'Birting ákæru og fyrirkalls tókst í máli {courtCaseNumber}<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the serive status in an indictment has changed',
  }),
}
