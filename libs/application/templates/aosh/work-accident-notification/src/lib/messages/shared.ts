import { defineMessages } from 'react-intl'

export const shared = {
  application: defineMessages({
    name: {
      id: 'aosh.wan.application:shared.name',
      defaultMessage: 'Tilkynning um vinnuslys',
      description: `Application's name`,
    },
    institutionName: {
      id: 'aosh.wan.application:shared.institution',
      defaultMessage: 'Vinnueftirlitið',
      description: `Institution's name`,
    },
  }),
  options: defineMessages({
    no: {
      id: 'aosh.wan.application:accident.about.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    yes: {
      id: 'aosh.wan.application:accident.about.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
  }),
}
