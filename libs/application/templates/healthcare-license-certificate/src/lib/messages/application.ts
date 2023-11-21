import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'hlc.application:name',
    defaultMessage: 'Umsókn um vottorð vegna starfsleyfis',
    description: `Application's name`,
  },
  institutionName: {
    id: 'hlc.application:institution',
    defaultMessage: 'Embætti Landlæknis',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'hlc.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'hlc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'hlc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'hlc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
