import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.dtcc.application:name',
    defaultMessage: 'Fyrirtækjakort',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.dtcc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.dtcc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.dtcc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.dtcc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
