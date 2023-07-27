import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.lpr.application:name',
    defaultMessage: 'Endurnýja einkamerki {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.lpr.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.lpr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.lpr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.lpr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
