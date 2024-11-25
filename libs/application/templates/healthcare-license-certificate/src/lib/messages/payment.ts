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
  confirmation: defineMessages({
    confirm: {
      id: 'hlc.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Confirm label',
    },
  }),
}
