import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.tmo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti að tæki {value}',
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
  historyLogApprovedByBuyer: {
    id: 'aosh.tmo.application:historyLogApprovedByBuyer',
    defaultMessage: 'Samþykkt af kaupanda',
    description: 'History log approved by buyer',
  },
  historyLogRejectedByBuyer: {
    id: 'aosh.tmo.application:historyLogRejectedByBuyer',
    defaultMessage: 'Hafnað af kaupanda',
    description: 'History log rejected by buyer',
  },
  actionCardPrerequisites: {
    id: 'aosh.tmo.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})
