import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.cov.application:name',
    defaultMessage: 'Bæta við umráðamanni á ökutæki {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.cov.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.cov.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.cov.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'ta.cov.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'ta.cov.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
})
