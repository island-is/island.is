import { defineMessages } from 'react-intl'

export const shared = {
  application: defineMessages({
    name: {
      id: 'aosh.wan.application:shared.application.name',
      defaultMessage: 'Tilkynning um vinnuslys',
      description: `Application's name`,
    },
    institutionName: {
      id: 'aosh.wan.application:shared.application.institution',
      defaultMessage: 'Vinnueftirlitið',
      description: `Institution's name`,
    },
    actionCardDone: {
      id: 'aosh.wan.application:shared.application.actionCardDone',
      defaultMessage: 'Afgreidd',
      description:
        'Description of application state/status when application is done',
    },
    actionCardDraft: {
      id: 'aosh.wan.application:shared.application.actionCardDraft',
      defaultMessage: 'Í vinnslu',
      description:
        'Description of application state/status when the application is in progress',
    },
    actionCardPrerequisites: {
      id: 'aosh.wan.application:shared.application.actionCardPrerequisites',
      defaultMessage: 'Gagnaöflun',
      description:
        'Description of application state/status when the application is in prerequisites',
    },
    prereqTabTitle: {
      id: 'aosh.wan.application:shared.application.prereqTabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of prerequisites tab',
    },
  }),
  options: defineMessages({
    no: {
      id: 'aosh.wan.application:shared.options.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    yes: {
      id: 'aosh.wan.application:shared.options.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
  }),
  buttons: defineMessages({
    deleteEmployee: {
      id: 'aosh.wan.application:shared.buttons.deleteEmployee',
      defaultMessage: 'Eyða starfsmanni',
      description: 'Delete employee',
    },
  }),
}
