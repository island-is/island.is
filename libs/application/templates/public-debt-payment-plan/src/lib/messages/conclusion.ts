import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'pdpp.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    alertTitle: {
      id: 'pdpp.application:conclusion.general.alertTitle',
      defaultMessage:
        'Umsókn um greiðsludreifingu hefur verið send til Innheimtumanns ',
      description: 'Conclusion screen alert title',
    },
  }),
  information: defineMessages({
    title: {
      id: 'pdpp.application:conclusion.information.title',
      defaultMessage: 'Hér eru næstu skref',
      description: 'Title of conclusion information box',
    },
    bulletOne: {
      id: 'pdpp.application:conclusion.information.bulletOne',
      defaultMessage:
        'Þú getur nálgast upplýsingar um greiðsluáætlun á mínum síðum.',
      description: 'Conclusion information box bulletOne',
    },
    bulletTwo: {
      id: 'pdpp.application:conclusion.information.bulletTwo',
      defaultMessage: 'Staðfesting verður send í rafræn skjöl á Ísland.is.',
      description: 'Conclusion information box bulletTwo',
    },
    bulletThree: {
      id: 'pdpp.application:conclusion.information.bulletThree',
      defaultMessage:
        'Innheimtumaður ríkissjóðs mun hafa samband við þig ef þörf er á frekari gögnum eða upplýsingum.',
      description: 'Conclusion information box bulletThree',
    },
  }),
}
