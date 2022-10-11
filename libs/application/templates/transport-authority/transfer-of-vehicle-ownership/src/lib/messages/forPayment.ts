import { defineMessages } from 'react-intl'

export const forPayment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.tvo.application:forPayment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.tvo.application:forPayment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
  }),
  labels: defineMessages({
    forPayment: {
      id: 'ta.tvo.application:forPayment.labels.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.tvo.application:forPayment.labels.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
    alertTitle: {
      id: 'ta.tvo.application:forPayment.labels.alertTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Alert title',
    },
    alertMessage: {
      id: 'ta.tvo.application:forPayment.labels.alertMessage',
      defaultMessage:
        'Ef ekki verður komið samþykki frá nýjum eiganda innan 7 daga verður greiðslan endurgreidd og salan gerð óvirk.',
      description: 'Alert message',
    },
  }),
}
