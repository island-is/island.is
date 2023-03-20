import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    title: {
      id: 'ctao.application:conclusion.general.title',
      defaultMessage: 'Umsókn staðfest',
      description: 'Title of conclusion screen',
    },
    alertTitle: {
      id: 'ctao.application:conclusion.general.alertTitle',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Conclusion screen alert title',
    },
  }),
  information: defineMessages({
    title: {
      id: 'ctao.application:conclusion.general.title',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Title of conclusion information box',
    },
    intro: {
      id: 'ctao.application:conclusion.general.intro#markdown',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: 'ctao.application:conclusion.general.bulletPoints#markdown',
      defaultMessage: `* Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.\n* Við verðum í sambandi ef okkur vantar frekari upplýsingar.\n* Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847 3759 eða á netfangið island@island.is`,
      description: 'Bullettpoints of information box',
    },
  }),
}
