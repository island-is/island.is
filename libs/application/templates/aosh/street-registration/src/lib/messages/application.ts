import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.sr.application:name',
    defaultMessage: 'Götuskráning tækis {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.sr.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'aosh.sr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'aosh.sr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardPrerequisites: {
    id: 'aosh.sr.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})
