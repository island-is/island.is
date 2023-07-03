import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'dlbui.application:name',
    defaultMessage: 'Ökunám - Breyta um ökukennara',
    description: `Application's name`,
  },
  institutionName: {
    id: 'dlbui.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardDraft: {
    id: 'dlbui.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'dlbui.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  pendingActionApplicationCompletedTitle: {
    id: 'dlbui.application:pendingActionApplicationCompletedTitle',
    defaultMessage: 'Búið er að breyta um ökukennara',
    description: 'Pending action application completed',
  },
})
