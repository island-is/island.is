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
  actionCardSubmitted: {
    id: 'ss.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  actionCardCompleted: {
    id: 'ss.application:actionCardCompleted',
    defaultMessage: 'Móttekin',
    description:
      'Description of application state/status when application is completed',
  },
  stateMetaNamePrerequisites: {
    id: 'ss.application:stateMetaNamePrerequisites',
    defaultMessage: 'Skilyrði',
    description:
      'Meta name of application state when the application is in prerequisites',
  },
  stateMetaNameDraft: {
    id: 'ss.application:stateMetaNameDraft',
    defaultMessage: 'Umsókn um framhaldsskóla',
    description:
      'Meta name of application state when the application is in draft',
  },
  stateMetaNameSubmitted: {
    id: 'ss.application:stateMetaNameSubmitted',
    defaultMessage: 'Submitted',
    description:
      'Meta name of application state when the application is in submitted',
  },
  stateMetaNameCompleted: {
    id: 'ss.application:stateMetaNameCompleted',
    defaultMessage: 'Completed',
    description:
      'Meta name of application state when the application is in completed',
  },
})
