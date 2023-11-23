import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'aosh.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'aosh.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aosh.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByReviewer: {
    id: 'aosh.application:historyLogApprovedByReviewer',
    defaultMessage: 'Samþykkt af öllum aðilum',
    description: 'History log approved by reviewer',
  },
})
