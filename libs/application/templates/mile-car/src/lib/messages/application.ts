import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'mcar.application:name',
    defaultMessage: 'Skráning á mílubíl',
    description: `Application's name`,
  },
  institutionName: {
    id: 'mcar.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'mcar.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'mcar.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'mcar.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
})
