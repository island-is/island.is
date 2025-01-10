import { defineMessages } from 'react-intl'

export const payment = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:payment.general.sectionTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment section title',
    },
    pageTitle: {
      id: 'doi.cs.application:payment.general.pageTitle',
      defaultMessage: 'Greiðsla',
      description: 'Payment page title',
    },
  }),
  confirmation: defineMessages({
    confirm: {
      id: 'doi.cs.application:payment.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Confirm label',
    },
  }),
}
