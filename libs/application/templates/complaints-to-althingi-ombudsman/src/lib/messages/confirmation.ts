import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ctao.application:confirmation.general.label',
      defaultMessage: 'Umsókn staðfest',
      description: 'general label',
    },
    title: {
      id: 'ctao.application:confirmation.general.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'general title',
    },
    infoBulletFirst: {
      id: 'ctao.application:confirmation.general.infoBulletFirst',
      defaultMessage:
        'Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.',
      description: 'First information sentence, in bullet list',
    },
    infoBulletSecond: {
      id: 'ctao.application:confirmation.general.infoBulletSecond',
      defaultMessage:
        'Við verðum í sambandi ef okkur vantar frekari upplýsingar.',
      description: 'Second information sentence, in bullet list',
    },
    infoBulletThird: {
      id: 'ctao.application:confirmation.general.infoBulletThird',
      defaultMessage:
        'Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847 3759 eða á netfangið island@island.is',
      description: 'Third information sentence, in bullet list',
    },
  }),
}
