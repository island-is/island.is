import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'doi.rpr.application:name',
    defaultMessage: 'Endurnýja dvalarleyfi',
    description: `Application's name`,
  },
  institutionName: {
    id: 'doi.rpr.application:institution',
    defaultMessage: 'Útlendingastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'doi.rpr.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'doi.rpr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'doi.rpr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'doi.rpr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
