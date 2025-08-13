import { defineMessages } from 'react-intl'

export const conclusionMessages = defineMessages({
  title: {
    id: 'tra.application:conclusion.title',
    defaultMessage: 'Staðfesting',
    description: 'Conclusion title',
  },
  alertTitle: {
    id: 'tra.application:conclusion.alertTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Conclusion alert title',
  },
  alertMessage: {
    id: 'tra.application:conclusion.alertMessage',
    defaultMessage:
      'Umsókn um {terminationType} húsaleigusamnings hefur verið send inn til Húsnæðis og mannvirkja stofnunar.',
    description: 'Conclusion alert message',
  },
})
