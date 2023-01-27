import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'dlui.application:name',
    defaultMessage: 'Ökunám - Breyta um ökukennara',
    description: `Application's name`,
  },
  institutionName: {
    id: 'dlui.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'dlui.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'dlui.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
