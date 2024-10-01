import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'mc.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment section title',
    },
  }),
  labels: defineMessages({
    forPayment: {
      id: 'mc.application:payment.labels.forPayment',
      defaultMessage: 'Til greiðslu',
      description: 'Payment for payment label',
    },
  }),
}
