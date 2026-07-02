import { defineMessages } from 'react-intl'

export const overviewMessages = defineMessages({
  sectionTitle: {
    id: 'cpn.application:overview.sectionTitle',
    defaultMessage: 'Samantekt',
    description: 'Overview',
  },
  description: {
    id: 'cpn.application:overview.description',
    defaultMessage:
      'Vinsamlegast farðu yfir tilkynninguna áður en þú sendir hana inn.',
    description: 'Please review the notification before submitting.',
  },
  submitButton: {
    id: 'cpn.application:overview.submitButton',
    defaultMessage: 'Senda inn tilkynningu',
    description: 'Submit notification',
  },
})
