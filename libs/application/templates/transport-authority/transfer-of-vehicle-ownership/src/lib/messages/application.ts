import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.tvo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti að ökutæki',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.tvo.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.tvo.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'cr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.tvo.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
