import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.overview.pageTitle`,
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview page title',
    },
    pageDescription: {
      id: `${t}:section.overview.pageDescription`,
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins hjá SÍ ef umsóknin er skýr og hnitmiðuð. ',
      description: 'Overview page description',
    },
  }),
  labels: defineMessages({
    submit: {
      id: `${t}:section.overview.submit`,
      defaultMessage: 'Staðfesta umsókn',
      description: 'Over submit field label',
    },
  }),
}
