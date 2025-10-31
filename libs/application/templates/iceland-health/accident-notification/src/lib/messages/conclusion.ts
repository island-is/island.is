import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'an.application:conclusion.general.title',
      defaultMessage: 'Tilkynning móttekin!',
      description: 'Title of conclusion screen',
    },
    alertTitle: {
      id: 'an.application:conclusion.general.alertTitle',
      defaultMessage:
        'Tilkynning um slys hefur verið send til Sjúkratryggingar Íslands',
      description: 'Conclusion screen alert title',
    },
  }),
  information: defineMessages({
    title: {
      id: 'an.application:conclusion.information.title',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Title of conclusion information box',
    },
    intro: {
      id: 'an.application:conclusion.information.intro#markdown',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: 'an.application:conclusion.information.bulletPoints#markdown',
      defaultMessage: `* Þriðji aðili fer yfir tilkynninguna og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fara Sjúkratryggingar Íslands yfir umsókn og er afstaða tekin til bótaskyldu.\n* Þegar fallist hefur verið á að um bótaskylt slys samkvæmt almannatryggingalögum sé að ræða er hinn slasaði upplýstur um rétt sinn til greiðslu bóta.`,
      description: 'Bullettpoints of information box',
    },
    description: {
      id: 'an.application:conclusion.information.description',
      defaultMessage:
        'Hjá Sjúkratryggingum er umsóknin yfirfarin. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til bótaskyldu.',
      description: 'Description of conclusion information box',
    },
  }),
}
