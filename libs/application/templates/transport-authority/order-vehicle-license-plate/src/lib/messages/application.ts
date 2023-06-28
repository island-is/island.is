import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.ovlp.application:name',
    defaultMessage: 'Panta skráningarmerki {value}',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.ovlp.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.ovlp.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ta.ovlp.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ta.ovlp.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  pendingActionOrderReceivedTitle: {
    id: 'ta.ovlp.application:pendingActionOrderReceivedTitle',
    defaultMessage: 'Pöntun á skráningarmerki móttekin',
    description: 'Pending action application completed',
  },
})
