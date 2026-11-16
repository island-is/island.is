import { defineMessages } from 'react-intl'

export const overviewMessages = defineMessages({
  sectionTitle: {
    id: 'stwlr.application:overview.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview',
  },
  description: {
    id: 'stwlr.application:overview.description',
    defaultMessage:
      'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
    description: 'Please review the application before submitting.',
  },
  submitButton: {
    id: 'stwlr.application:overview.submitButton',
    defaultMessage: 'Senda inn umsókn',
    description: 'Submit application',
  },
  waitingListConsent: {
    id: 'stwlr.application:overview.waitingListConsent',
    defaultMessage: 'Skráning á biðlista',
    description: 'Waiting list registration',
  },
  confirmCorrectInfo: {
    id: 'stwlr.application:overview.confirmCorrectInfo',
    defaultMessage:
      'Ég staðfesti að ég hef skráð upplýsingar samkvæmt bestu vitund og vitneskju',
    description:
      'I confirm that I have entered the information to the best of my knowledge',
  },
})
