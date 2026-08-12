import { defineMessages } from 'react-intl'

export const applicationCardMessages = defineMessages({
  newNotificationButton: {
    id: 'cpn.application:shared.newNotificationButton',
    defaultMessage: 'Ný tilkynning',
    description: 'Label for the button to start a new notification',
  },
  openNotificationButton: {
    id: 'cpn.application:shared.openNotificationButton',
    defaultMessage: 'Opna tilkynningu',
    description: 'Label for the button to open an existing notification',
  },
  notificationInProgressTag: {
    id: 'cpn.application:shared.notificationInProgressTag',
    defaultMessage: 'Tilkynning í vinnslu hjá þér',
    description: 'Tag label for a notification draft in progress',
  },
  historyNotificationStarted: {
    id: 'cpn.application:shared.historyNotificationStarted',
    defaultMessage: 'Tilkynning hafin',
    description: 'History log entry when a notification is started',
  },
  historyNotificationSent: {
    id: 'cpn.application:shared.historyNotificationSent',
    defaultMessage: 'Tilkynning send',
    description: 'History log entry when a notification is submitted',
  },
  notificationReceivedTitle: {
    id: 'cpn.application:shared.notificationReceivedTitle',
    defaultMessage: 'Tilkynning afgreidd',
    description: 'Pending action title shown on completed notification card',
  },
  notificationReceivedContent: {
    id: 'cpn.application:shared.notificationReceivedContent',
    defaultMessage:
      'Tilkynningin þín hefur verið send til barnaverndarþjónustu.',
    description:
      'Pending action description shown on completed notification card',
  },
})
