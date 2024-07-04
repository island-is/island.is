import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'hlc.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment section title',
    },
    pageTitle: {
      id: 'hlc.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment page title',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'hlc.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'hlc.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'hlc.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Confirm label',
    },
  }),
}
