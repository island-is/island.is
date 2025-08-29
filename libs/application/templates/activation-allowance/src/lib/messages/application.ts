import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aa.application:name',
    defaultMessage: 'Umsókn um virknistyrk',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aa.application:institutionName',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardApplicationSent: {
    id: 'aa.application:actionCardApplicationSent',
    defaultMessage: 'Innsend',
    description: 'Label for the action card when application in submitted',
  },
  actionCardDraft: {
    id: 'aa.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardRejected: {
    id: 'aa.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description:
      'Description of application state/status when application is rejected',
  },
  actionCardDone: {
    id: 'aa.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardPrerequisites: {
    id: 'aa.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  confirmButtonLabel: {
    id: 'aa.application:confirmButtonLabel',
    defaultMessage: 'Staðfesta',
    description: 'Confirm button label',
  },
  yesLabel: {
    id: 'aa.application:yesLabel',
    defaultMessage: 'Já',
    description: 'Yes label',
  },
  noLabel: {
    id: 'aa.application:noLabel',
    defaultMessage: 'Nei',
    description: 'No label',
  },
})
