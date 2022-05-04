import { defineMessages } from '@formatjs/intl'
import { MessageTypes } from './app/modules/notifications/types'

export default {
  notifications: {
    [MessageTypes.NewDocumentMessage]: defineMessages({
      title: {
        id: 'user-notification.messages:new-document-title',
        description: 'Title of message letting user know of new inbox document',
        defaultMessage: 'Nýtt skjal á island.is',
      },
      body: {
        id: 'user-notification.messages:new-document-body',
        description: 'Body of message letting user know of new inbox document',
        defaultMessage: 'Þú átt nýtt skjal á island.is frá: {organization}',
      },
    }),
    [MessageTypes.OneshotMessage]: defineMessages({
      title: {
        id: 'user-notification.messages:oneshot-title',
        description: 'Title of a simple notification',
        defaultMessage: 'Þú ert með tilkynningu',
      },
      body: {
        id: 'user-notification.messages:oneshot-body',
        description: 'Body of message letting user know of a simple notification',
        defaultMessage: '{organization} er að tilkynna þér eitthvað',
      },
    }),
    [MessageTypes.Invalid]: defineMessages({
      title: {
        id: 'user-notification.messages:invalid-title',
        description: 'Invalid notification title',
        defaultMessage: '',
      },
      body: {
        id: 'user-notification.messages:invalid-body',
        description: 'Invalid notification body',
        defaultMessage: '',
      },
    }),
  },
}
