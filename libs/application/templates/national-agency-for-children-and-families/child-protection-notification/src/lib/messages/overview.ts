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
  accuracyConfirmation: {
    id: 'cpn.application:overview.accuracyConfirmation',
    defaultMessage:
      'Ég staðfesti að ég hef skráð upplýsingar samkvæmt bestu vitund og vitneskju',
    description: 'Accuracy confirmation',
  },
  submitButton: {
    id: 'cpn.application:overview.submitButton',
    defaultMessage: 'Senda inn tilkynningu',
    description: 'Submit notification',
  },
})
