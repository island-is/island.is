import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'hwp.application:name',
    defaultMessage: 'Umsókn um starfsleyfi',
    description: `Application's name`,
  },
  institutionName: {
    id: 'hwp.application:institution',
    defaultMessage: 'Embætti Landlæknis',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'hwp.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'hwp.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'hwp.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'hwp.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
