import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.ovrc.application:name',
    defaultMessage: 'Panta skráningarskírteini {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.ovrc.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.ovrc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.ovrc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.ovrc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  pendingActionOrderReceivedTitle: {
    id: 'ta.ovrc.application:pendingActionOrderReceivedTitle',
    defaultMessage: 'Pöntun á skráningarskírteini móttekin',
    description: 'Pending action application completed',
  },
})
