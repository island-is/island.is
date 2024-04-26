import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
    },
  }),
  paymentChargeOverview: defineMessages({
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
