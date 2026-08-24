import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'pd.application:name',
    defaultMessage: 'Greiðsla skulda frá ríkinu',
    description: `Application's name`,
  },
  institutionName: {
    id: 'pd.application:institution',
    defaultMessage: 'Fjársýsla ríkisins',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'pd.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'pd.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardCompleted: {
    id: 'pd.application:actionCardCompleted',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when the application is completed',
  },
  stateMetaNamePrerequisites: {
    id: 'pd.application:stateMetaNamePrerequisites',
    defaultMessage: 'Skilyrði',
    description:
      'Meta name of application state when the application is in prerequisites',
  },
  stateMetaNameDraft: {
    id: 'pd.application:stateMetaNameDraft',
    defaultMessage: 'Umsókn',
    description:
      'Meta name of application state when the application is in draft',
  },
  stateMetaNameCompleted: {
    id: 'pd.application:stateMetaNameCompleted',
    defaultMessage: 'Lokið',
    description:
      'Meta name of application state when the application is in completed',
  },
})
