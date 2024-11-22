import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
    pageTitle: {
      id: 'ta.ovlp.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment page',
    },
    confirm: {
      id: 'ta.ovlp.application:payment.general.confirm',
      defaultMessage: 'Staðfesta',
      description: 'confirm',
    },
  }),
  paymentChargeOverview: defineMessages({
    forPayment: {
      id: 'ta.ovlp.application:payment.paymentChargeOverview.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'For payment label',
    },
    total: {
      id: 'ta.ovlp.application:payment.paymentChargeOverview.total',
      defaultMessage: 'Samtals',
      description: 'Total amount label',
    },
    frontLabel: {
      id: 'ta.ovlp.application:payment.paymentChargeOverview.frontLabel',
      defaultMessage: 'merki að framan',
      description: 'Front plate label',
    },
    rearLabel: {
      id: 'ta.ovlp.application:payment.paymentChargeOverview.rearLabel',
      defaultMessage: 'merki að aftan',
      description: 'Rear plate label',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'ta.ovlp.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
