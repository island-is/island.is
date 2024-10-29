import { defineMessage } from '@formatjs/intl'

export const strings = {
  serviceSuccessfulSubject: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_successful_subject',
    defaultMessage: 'Birting tókst í máli {courtCaseNumber}',
    description:
      'Subject of the notification sent when the serive status in an indictment has changed',
  }),
  serviceSuccessfulBody: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_successful_body',
    defaultMessage:
      'Birting ákæru og fyrirkalls tókst í máli {courtCaseNumber}.<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the serive status in an indictment has changed',
  }),
  serviceFailedSubject: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_failed_subject',
    defaultMessage: 'Birting árangurslaus í máli {courtCaseNumber}',
    description:
      'Subject of the notification sent when the serive status in an indictment has changed',
  }),
  serviceFailedBody: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.service_failed_body',
    defaultMessage:
      'Birting ákæru og fyrirkalls var árangurslaus í máli {courtCaseNumber}.<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the serive status in an indictment has changed',
  }),
  defendantSelectedDefenderSubject: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.defendant_selected_defender_subject',
    defaultMessage: 'Val á verjanda í máli {courtCaseNumber}',
    description:
      'Subject of the notification sent when the serive status in an indictment has changed',
  }),
  defendantSelectedDefenderBody: defineMessage({
    id: 'judicial.system.backend:subpoena_notifications.defendant_selected_defender_body',
    defaultMessage:
      'Verjandi hefur verið valinn í máli {courtCaseNumber}.<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the serive status in an indictment has changed',
  }),
}
