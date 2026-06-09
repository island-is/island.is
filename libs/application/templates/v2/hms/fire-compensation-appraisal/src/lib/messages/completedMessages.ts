import { defineMessages } from 'react-intl'

export const completedMessages = defineMessages({
  tabTitle: {
    id: 'fca.application:completed.title',
    defaultMessage: 'Umsókn skilað',
    description: 'Completed tab title',
  },
  alertTitle: {
    id: 'fca.application:completed.alertTitle',
    defaultMessage: 'Umsókn hefur verið send',
    description: 'Completed alert title',
  },
  alertMessage: {
    id: 'fca.application:completed.alertMessage',
    defaultMessage:
      'Umsókn þín um endurmat brunabótamats hefur verið send inn til HMS til yfirferðar',
    description: 'Completed alert message',
  },
  actionCardDone: {
    id: 'fca.application:completed.actionCardDone',
    defaultMessage: 'Send til HMS',
    description: 'Action card done',
  },
})
