import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.dtdc.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
    tryAgain: {
      id: 'ta.dtdc.application:payment.general.tryAgain',
      defaultMessage: 'Reyna aftur',
      description: '',
    },
    forwardingToPayment: {
      id: 'ta.dtdc.application:payment.general.forwardingToPayment',
      defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
      description: 'Forwarding you to payment handler...',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'ta.dtdc.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.dtdc.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'ta.dtdc.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
