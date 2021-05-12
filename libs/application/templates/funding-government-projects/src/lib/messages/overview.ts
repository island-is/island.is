import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: `affgp.application:section.overview.pageTitle`,
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview page title',
    },
    pageDescription: {
      id: `affgp.application:section.overview.pageDescription`,
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins ef umsóknin er skýr og hnitmiðuð. ',
      description: 'Overview page description',
    },
  }),
  labels: defineMessages({
    submit: {
      id: `affgp.application:section.overview.submit`,
      defaultMessage: 'Staðfesta umsókn',
      description: 'Over submit field label',
    },
  }),
}
