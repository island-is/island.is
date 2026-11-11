import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.mlcr.application:application.name',
    defaultMessage: 'Endurútgáfa plastkorts',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.mlcr.application:application.institutionName',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'aosh.mlcr.application:application.actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'aosh.mlcr.application:application.actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'aosh.mlcr.application:application.actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  prerequisiteTabTitle: {
    id: 'aosh.mlcr.application:application.prerequisiteTabTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Browser tab title for prerequisite section',
  },
})
