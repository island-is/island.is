import { defineMessages } from 'react-intl'

export const application = defineMessages({
  yes: {
    id: 'nhh.application:yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  no: {
    id: 'nhh.application:no',
    defaultMessage: 'Nei',
    description: 'No',
  },
  applicationName: {
    id: 'nhh.application:applicationName',
    defaultMessage: 'Námskeið HH {value}',
    description: 'Application name',
  },
  institutionName: {
    id: 'nhh.application:institution',
    defaultMessage: 'Húsnæðis- og mannvirkjastofnun',
    description: 'Institution name',
  },
  actionCardDone: {
    id: 'nhh.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardDraft: {
    id: 'nhh.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPrerequisites: {
    id: 'nhh.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})

