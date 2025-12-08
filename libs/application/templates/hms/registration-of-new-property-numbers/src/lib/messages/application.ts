import { defineMessages } from 'react-intl'

export const application = defineMessages({
  yes: {
    id: 'ronp.application:yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  no: {
    id: 'ronp.application:no',
    defaultMessage: 'Nei',
    description: 'No',
  },
  applicationName: {
    id: 'ronp.application:applicationName',
    defaultMessage: 'Stofnun á nýjum fasteignanúmerum {value}',
    description: 'Application name',
  },
  institutionName: {
    id: 'ronp.application:institution',
    defaultMessage: 'Húsnæðis- og mannvirkjastofnun',
    description: 'Institution name',
  },
  actionCardDone: {
    id: 'ronp.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is done',
  },
  actionCardDraft: {
    id: 'ronp.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPrerequisites: {
    id: 'ronp.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
})
