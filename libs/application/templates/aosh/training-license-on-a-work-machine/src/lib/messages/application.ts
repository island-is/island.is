import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.tlwm.application:name',
    defaultMessage: 'Kennsluréttindi á vinnuvél',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.tlwm.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.tlwm.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardReview: {
    id: 'aosh.tlwm.application:actionCardReview',
    defaultMessage: 'Í samþykktarferli',
    description:
      'Description of application state/status when the application is in review',
  },
  actionCardDone: {
    id: 'aosh.tlwm.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardRejected: {
    id: 'aosh.tlwm.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardPrerequisites: {
    id: 'aosh.tlwm.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  historyLogInReview: {
    id: 'aosh.tlwm.application:historyLogInReview',
    defaultMessage: 'Umsókn í samþykktarferli',
    description: 'History log when application is sent for review',
  },
  connectionError: {
    id: 'aosh.tlwm.application:connectionError',
    defaultMessage: 'Ekki náðist að sækja gögnin',
    description: 'Was not able to get data',
  },
})
