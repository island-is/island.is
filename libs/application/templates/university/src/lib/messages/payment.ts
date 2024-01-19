import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment section title',
    },
    pageTitle: {
      id: 'uni.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment page title',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'uni.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'uni.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'uni.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Confirm label',
    },
  }),
}
