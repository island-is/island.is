import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.rnm.application:name',
    defaultMessage: 'Nýskráning tækis',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.rnm.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.rnm.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'aosh.rnm.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardPrerequisites: {
    id: 'aosh.rnm.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  connectionError: {
    id: 'aosh.rnm.application:connectionError',
    defaultMessage: 'Ekki náðist að sækja gögnin',
    description: 'Was not able to get data',
  },
})
