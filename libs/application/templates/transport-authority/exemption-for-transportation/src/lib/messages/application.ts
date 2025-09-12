import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ta.eft.application:name',
    defaultMessage: 'Umsókn um undanþágu vegna flutnings',
    description: `Application's name`,
  },
  nameShortTerm: {
    id: 'ta.eft.application:nameShortTerm',
    defaultMessage: 'Umsókn um skammtímaundanþágu vegna flutnings',
    description: `Application's name for short-term`,
  },
  nameLongTerm: {
    id: 'ta.eft.application:nameLongTerm',
    defaultMessage: 'Umsókn um langtímaundanþágu vegna flutnings',
    description: `Application's name for long-term`,
  },
  institutionName: {
    id: 'ta.eft.application:institution',
    defaultMessage: 'Samgöngustofa',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'ta.eft.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'ta.eft.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardPayment: {
    id: 'ta.eft.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when the application is in payment',
  },
  actionCardCompleted: {
    id: 'ta.eft.application:actionCardCompleted',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is completed',
  },
  stateMetaNamePrerequisites: {
    id: 'ta.eft.application:stateMetaNamePrerequisites',
    defaultMessage: 'Prerequisites',
    description:
      'Meta name of application state when the application is in prerequisites',
  },
  stateMetaNameDraft: {
    id: 'ta.eft.application:stateMetaNameDraft',
    defaultMessage: 'Draft',
    description:
      'Meta name of application state when the application is in draft',
  },
  stateMetaNamePayment: {
    id: 'ta.eft.application:stateMetaNamePayment',
    defaultMessage: 'Payment',
    description:
      'Meta name of application state when the application is in payment',
  },
  stateMetaNameCompleted: {
    id: 'ta.eft.application:stateMetaNameCompleted',
    defaultMessage: 'Completed',
    description:
      'Meta name of application state when the application is in completed',
  },
})
