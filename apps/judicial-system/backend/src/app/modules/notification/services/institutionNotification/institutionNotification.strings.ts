import { defineMessage, defineMessages } from '@formatjs/intl'

export const strings = {
  waitingForConfirmation: defineMessages({
    subject: {
      id: 'judicial.system.backend:institution_notifications.waiting_for_confirmation.subject',
      defaultMessage: 'Ákærur bíða staðfestingar',
      description:
        'Subject of the notification sent when indictments are waiting for confirmation',
    },
    body: {
      id: 'judicial.system.backend:institution_notifications.waiting_for_confirmation.body',
      defaultMessage:
        'Í Réttarvörslugátt {count, select, 1 {bíður 1 ákæra} other {bíða {count} ákærur}} staðfestingar.',
      description:
        'Body of the notification sent when indictments are waiting for confirmation',
    },
  }),
  tail: defineMessage({
    id: 'judicial.system.backend:institution_notifications.tail_v2',
    defaultMessage:
      'Hægt er að nálgast yfirlit og staðfesta ákærur í {linkStart}Réttarvörslugátt{linkEnd}.',
    description:
      'Tail of the notification sent when indictments are waiting for confirmation',
  }),
}
