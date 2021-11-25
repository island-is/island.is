import { defineMessages } from 'react-intl'

export const fatalAccident = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:fatalAccident.general.sectionTitle',
      defaultMessage: 'Var slysið banaslys?',
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
  alertMessage: defineMessages({
    title: {
      id: 'an.application:fatalAccident.alertMessage.title',
      defaultMessage: 'Athugið',
      description:
        'Bold title in alert when uploading required attachment later',
    },
    description: {
      id: 'an.application:fatalAccident.alertMessage.description',
      defaultMessage:
        'Það er hægt að bæta við skjölum eftir að umsókn hefur verið send inn. Áður en að Sjúkratryggingar Íslands fer yfir umsókn og tekur afstöðu til bótaskyldu þarf lögregluskýrsla að vera til staðar.',
      description:
        'Description message in Alert when uploading required attachment later',
    },
  }),
}
