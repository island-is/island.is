import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.rifm.application:name',
    defaultMessage: 'Beiðni um skoðun tækis {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.rifm.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.rifm.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'aosh.rifm.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'aosh.rifm.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aosh.rifm.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByReviewer: {
    id: 'aosh.rifm.application:historyLogApprovedByReviewer',
    defaultMessage: 'Samþykkt af öllum aðilum',
    description: 'History log approved by reviewer',
  },
  actionCardPrerequisites: {
    id: 'aosh.rifm.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})
