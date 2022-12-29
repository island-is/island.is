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
    [MessageTypes.TestMessage]: defineMessages({
      title: {
        id: 'user-notification.messages:test-message-title',
        description: 'title desc',
        defaultMessage: 'test-message-title',
      },
      body: {
        id: 'user-notification.messages:test-message-body',
        description: 'body desc',
        defaultMessage: 'test-message-body',
      },
    }),
  },
}
