import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.dtwc.application:name',
    defaultMessage: 'Verkstæðiskort',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.dtwc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.dtwc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.dtwc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.dtwc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
