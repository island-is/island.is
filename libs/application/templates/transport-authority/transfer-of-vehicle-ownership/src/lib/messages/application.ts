import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.tvo.application:name',
    defaultMessage: 'Tilkynning um eigendaskipti að ökutæki {value}',
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
    id: 'ta.tvo.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardRejected: {
    id: 'ta.tvo.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'ta.tvo.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  historyLogSentApplication: {
    id: 'ta.tvo.application:historyLogSentApplication',
    defaultMessage: 'Umsókn send á Samgöngustofu',
    description: 'History log application sent',
  },
})
