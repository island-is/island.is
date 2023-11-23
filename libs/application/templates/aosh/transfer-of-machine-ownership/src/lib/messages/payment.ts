import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'aosh.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'aosh.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'aosh.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
    alertTitle: {
      id: 'aosh.application:payment.paymentChargeOverview.alertTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Alert title',
    },
    alertMessage: {
      id: 'aosh.application:payment.paymentChargeOverview.alertMessage',
      defaultMessage:
        'Ef ekki verður komið samþykki frá nýjum eiganda innan 7 daga verður greiðslan endurgreidd og salan gerð óvirk.',
      description: 'Alert message',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'aosh.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
