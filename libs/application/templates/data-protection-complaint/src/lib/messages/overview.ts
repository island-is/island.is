import { defineMessage, defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.overview.pageTitle',
      defaultMessage: 'Yfirlit kvörtunar',
      description: 'overview page title',
    },
    pageDescription: {
      id: 'dpac.application:section.overview.pageDescription',
      defaultMessage: `Farðu vel yfir efnið áður en þú sendir inn kvörtunina. Það flýtir fyrir afgreiðslu málsins hjá Persónuvernd ef kvörtunin er skýr og afmörkuð.`,
      description: 'overview page description',
    },
  }),
  labels: defineMessage({
    termsAgreement: {
      id: 'dpac.application:section.overview.labels.termsAgreement',
      defaultMessage:
        'Ég samþykki að Persónuvernd hefur leyfi til þess að nota persónuupplýsingar til meðferðar á þessari umsókn.',
      description: 'Terms agreement label',
    },
  }),
}
