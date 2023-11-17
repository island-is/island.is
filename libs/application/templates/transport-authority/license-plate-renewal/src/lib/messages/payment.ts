import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.lpr.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Title of for payment section',
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
