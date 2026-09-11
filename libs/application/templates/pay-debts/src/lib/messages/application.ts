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
