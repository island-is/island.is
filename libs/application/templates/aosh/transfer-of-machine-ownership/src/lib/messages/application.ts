import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.tmo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.tmo.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.tmo.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'aosh.tmo.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'aosh.tmo.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aosh.tmo.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByReviewer: {
    id: 'aosh.tmo.application:historyLogApprovedByReviewer',
    defaultMessage: 'Samþykkt af öllum aðilum',
    description: 'History log approved by reviewer',
  },
})
