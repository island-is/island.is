import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.avr.application:name',
    defaultMessage: 'Nafnleynd í ökutækjaskrá',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ta.avr.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'ta.avr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'ta.avr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  pendingActionApplicationCompletedTitle: {
    id: 'ta.avr.application:pendingActionApplicationCompletedTitle',
    defaultMessage: 'Búið er að uppfæra nafnleynd',
    description: 'Pending action application completed',
  },
})
