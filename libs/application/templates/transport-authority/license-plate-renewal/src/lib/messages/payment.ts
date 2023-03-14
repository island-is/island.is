import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.lpr.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.lpr.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'ta.lpr.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.lpr.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'ta.lpr.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
