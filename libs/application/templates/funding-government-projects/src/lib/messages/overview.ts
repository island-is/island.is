import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: `section.overview.pageTitle`,
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview page title',
    },
    pageDescription: {
      id: `section.overview.pageDescription`,
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins ef umsóknin er skýr og hnitmiðuð. ',
      description: 'Overview page description',
    },
  }),
  labels: defineMessages({
    submit: {
      id: `section.overview.submit`,
      defaultMessage: 'Staðfesta umsókn',
      description: 'Over submit field label',
    },
  }),
}
