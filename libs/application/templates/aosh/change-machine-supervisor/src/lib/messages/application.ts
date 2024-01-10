import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.cms.application:name',
    defaultMessage: 'Tilkynning um umráðaskipti',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.cms.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.cms.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'aosh.cms.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'aosh.cms.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aosh.cms.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogApprovedByReviewer: {
    id: 'aosh.cms.application:historyLogApprovedByReviewer',
    defaultMessage: 'Samþykkt af öllum aðilum',
    description: 'History log approved by reviewer',
  },
  actionCardPrerequisites: {
    id: 'hlc.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})
