import { defineMessages } from 'react-intl'

export const fatalAccident = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:fatalAccident.general.sectionTitle',
      defaultMessage: 'Banaslys ',
      description: 'Fatal accident',
    },
  }),
  labels: defineMessages({
    title: {
      id: 'an.application:fatalAccident.labels.title',
      defaultMessage: 'Var slysið banaslys?',
      description: 'Was the accident fatal?',
    },
    fatalAccident: {
      id: 'an.application:fatalAccident.labels.fatalAccident',
      defaultMessage: 'Banaslys',
      description: 'Fatal accident label',
    },
  }),
}
