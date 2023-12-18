import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ef.application:name',
    defaultMessage: 'Styrkur vegna kaupa á rafbílum',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ef.application:institution',
    defaultMessage: 'Orkustofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'ef.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'ef.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'ef.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'ef.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
