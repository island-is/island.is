import { defineMessages } from 'react-intl'

const bulletOne =
  'Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.'
const bulletTwo = 'Við verðum í sambandi ef okkur vantar frekari upplýsingar.'
const bulletThree =
  'Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847 3759 eða á netfangið island@island.is'

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
      id: 'ctao.application:conclusion.general.intro',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: 'ctao.application:conclusion.general.bulletPoints#markdown',
      defaultMessage: `* ${bulletOne}\n* ${bulletTwo}\n* ${bulletThree}`,
      description: 'Bullettpoints of information box',
    },
  }),
}
