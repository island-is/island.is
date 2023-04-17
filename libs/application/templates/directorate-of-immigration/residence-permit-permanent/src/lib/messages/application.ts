import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'doi.rpp.application:name',
    defaultMessage: 'Ótímabundið dvalarleyfi',
    description: `Application's name`,
  },
  institutionName: {
    id: 'doi.rpp.application:institution',
    defaultMessage: 'Útlendingastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'doi.rpp.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'doi.rpp.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'doi.rpp.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'doi.rpp.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
})
