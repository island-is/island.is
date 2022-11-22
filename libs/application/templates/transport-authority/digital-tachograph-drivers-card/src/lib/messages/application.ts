import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.dtdc.application:name',
    defaultMessage: 'Ökumannskort',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.dtdc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.dtdc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.dtdc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.dtdc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
