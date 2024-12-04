import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ss.application:name',
    defaultMessage: 'Umsókn um framhaldsskóla',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ss.application:institution',
    defaultMessage: 'Miðstöð menntunar og skólaþjónustu',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'ss.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'ss.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'ss.application:actionCardDone',
    defaultMessage: 'Móttekin',
    description:
      'Description of application state/status when application is processed',
  },
})
