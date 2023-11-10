import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'doi.cs.application:name',
    defaultMessage: 'Ríkisborgararéttur',
    description: `Application's name`,
  },
  institutionName: {
    id: 'doi.cs.application:institution',
    defaultMessage: 'Útlendingastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'doi.cs.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'doi.cs.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'doi.cs.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'doi.cs.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
