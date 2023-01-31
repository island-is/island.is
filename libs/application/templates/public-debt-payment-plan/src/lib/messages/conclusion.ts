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
        'Umsókn um greiðsluáætlun hefur verið send til Innheimtumanns',
      description: 'Conclusion screen alert title',
    },
    alertMessage: {
      id: 'pdpp.application:conclusion.general.alertMessage',
      defaultMessage: 'Þú getur nú nálgast umsóknina inni á mínum síðum',
      description: 'Conclusion screen alert message',
    },
  }),
  information: defineMessages({
    title: {
      id: 'pdpp.application:conclusion.information.title',
      defaultMessage: 'Hér eru næstu skref',
      description: 'Title of conclusion information box',
    },
    intro: {
      id: 'pdpp.application:conclusion.information.intro',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: 'pdpp.application:conclusion.information.bulletList#markdown',
      defaultMessage:
        '* Þú getur nálgast upplýsingar um greiðsluáætlun á mínum síðum.\n* Staðfesting verður send í rafræn skjöl á Ísland.is.\n* Innheimtumaður ríkissjóðs mun hafa samband við þig ef þörf er á frekari gögnum eða upplýsingum.',
      description: 'Conclusion information box bullet list',
    },
  }),
}
