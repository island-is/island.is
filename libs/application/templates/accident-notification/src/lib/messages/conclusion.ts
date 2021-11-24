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
    description: {
      id: 'an.application:conclusion.information.description',
      defaultMessage:
        'Hjá Sjúkratryggingum er umsóknin yfirfarin. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til bótaskyldu.',
      description: 'Description of conclusion information box',
    },
    bulletOne: {
      id: 'an.application:conclusion.information.bulletOne',
      defaultMessage:
        'Þriðji aðilli fer yfir tilkynninguna og staðfestir að allar upplýsingar eru réttar',
      description: 'Conclusion information box bulletOne',
    },
    bulletTwo: {
      id: 'an.application:conclusion.information.bulletTwo',
      defaultMessage:
        'Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.',
      description: 'Conclusion information box bulletTwo',
    },
    bulletThree: {
      id: 'an.application:conclusion.information.bulletThree',
      defaultMessage:
        'Þegar öll nauðsynleg gögn hafa borist, fer Sjúkratryggingar Íslands yfir umsókn og er afstaða tekin til bótaskyldu.',
      description: 'Conclusion information box bulletThree',
    },
    bulletFour: {
      id: 'an.application:conclusion.information.bulletFour',
      defaultMessage:
        'Þegar fallist hefur verið á að um bótaskylt slys samkvæmt almannatryggingalögum sé að ræða er hinn slasaði upplýstur um rétt sinn til greiðslu bóta.',
      description: 'Conclusion information box bulletFour',
    },
  }),
}
