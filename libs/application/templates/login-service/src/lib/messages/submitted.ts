import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const submitted = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.submitted.pageTitle`,
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'submitted page title',
    },
  }),
  labels: defineMessages({
    descriptionBulletOne: {
      id: `${t}:section.submitted.descriptionBulletOne`,
      defaultMessage:
        'Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.',
      description: 'submitted descriptionBulletOne',
    },
    descriptionBulletTwo: {
      id: `${t}:section.submitted.descriptionBulletTwo`,
      defaultMessage:
        'Við verðum í sambandi ef okkur vantar frekari upplýsingar.',
      description: 'submitted descriptionBulletTwo',
    },
    descriptionBulletThree: {
      id: `${t}:section.submitted.descriptionBulletThree`,
      defaultMessage:
        'Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma {tel} eða á netfangið',
      description: 'submitted descriptionBulletThree',
    },
  }),
}
