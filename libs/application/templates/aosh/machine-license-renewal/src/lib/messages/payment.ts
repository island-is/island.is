import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of payment section',
    },
  }),
  errors: defineMessages({
    paymentNotReceived: {
      id: 'aosh.mlr.application:payment.errors.paymentNotReceived',
      defaultMessage:
        'Greiðslan hefur ekki enn borist Vinnueftirlitinu. Vinsamlegast reyndu aftur eftir smá stund.',
      description: 'Error when Vinnueftirlitið has not received the payment',
    },
  }),
}
