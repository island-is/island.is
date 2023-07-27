import { defineMessages } from 'react-intl'

export const submitted = {
  general: defineMessages({
    pageTitle: {
      id: `affgp.application:section.submitted.pageTitle`,
      defaultMessage: 'Umsókn móttekin!',
      description: 'Submitted page title',
    },
    alertTitle: {
      id: `affgp.application:section.submitted.alertTitle`,
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Submitted alert title',
    },
  }),
  labels: defineMessages({
    title: {
      id: `affgp.application:section.submitted.title`,
      defaultMessage: 'Hvað gerist næst?',
      description: 'Title of conclusion information box',
    },
    intro: {
      id: `affgp.application:section.submitted.intro#markdown`,
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion information box intro',
    },
    bulletList: {
      id: `affgp.application:section.submitted.bulletList#markdown`,
      defaultMessage: `* Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.\n* Við verðum í sambandi ef okkur vantar frekari upplýsingar.\n* Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847 3759 eða á netfangið [island@island.is](mailto:island@island.is)`,
      description: 'BulletList',
    },
  }),
}
