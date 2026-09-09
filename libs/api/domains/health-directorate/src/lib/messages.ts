import { defineMessages } from 'react-intl'

export const m = defineMessages({
  webChatTitle: {
    id: 'api.health-directorate:web-chat-title',
    defaultMessage: 'Ráðgjöf í netspjalli Heilsuveru',
  },
  webChatStatusOpen: {
    id: 'api.health-directorate:web-chat-status-open',
    defaultMessage: 'Opið núna.',
  },
  webChatStatusClosed: {
    id: 'api.health-directorate:web-chat-status-closed',
    defaultMessage: 'Lokað núna.',
  },
  webChatDescription: {
    id: 'api.health-directorate:web-chat-description',
    defaultMessage: '{status} Opið frá 8:00 til 15:30 virka daga.',
  },
  webChatUrl: {
    id: 'api.health-directorate:web-chat-url',
    defaultMessage: 'https://direct.lc.chat/15092154',
  },
})
