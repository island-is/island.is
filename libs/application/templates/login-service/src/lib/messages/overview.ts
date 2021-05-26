import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.overview.pageTitle`,
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview page title',
    },
    pageDescription: {
      id: `ls.application:section.overview.pageDescription`,
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins hjá SÍ ef umsóknin er skýr og hnitmiðuð. ',
      description: 'Overview page description',
    },
  }),
  labels: defineMessages({
    submit: {
      id: `ls.application:section.overview.submit`,
      defaultMessage: 'Staðfesta umsókn',
      description: 'Over submit field label',
    },
  }),
}
