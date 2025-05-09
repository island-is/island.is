import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.ioc.application:name',
    defaultMessage: 'Útgáfa skírteina',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.ioc.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.ioc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardReview: {
    id: 'aosh.ioc.application:actionCardReview',
    defaultMessage: 'Í samþykktarferli',
    description:
      'Description of application state/status when the application is in review',
  },
  actionCardDone: {
    id: 'aosh.ioc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardRejected: {
    id: 'aosh.ioc.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardPrerequisites: {
    id: 'aosh.ioc.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  historyLogInReview: {
    id: 'aosh.ioc.application:historyLogInReview',
    defaultMessage: 'Umsókn í samþykktarferli',
    description: 'History log when application is sent for review',
  },
  connectionError: {
    id: 'aosh.ioc.application:connectionError',
    defaultMessage: 'Ekki náðist að sækja gögnin',
    description: 'Was not able to get data',
  },
})
