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
    confirmationPageTitle: {
      id: 'dpac.application:section.confirmation.pageTitle',
      defaultMessage: 'Kvörtunin hefur verið send til Persónuverndar. ',
      description: 'confirmation page title',
    },
  }),
  labels: defineMessage({
    sendApplication: {
      id: 'dpac.application:section.overview.labels.sendApplication',
      defaultMessage: 'Senda',
      description: 'Send button on overview screen',
    },
    delimitationAccordionTitle: {
      id: 'dpac.application:section.overview.labels.delimitationAccordionTitle',
      defaultMessage: 'Afmörkun kvörtunar',
      description: 'delimitationAccordionTitle',
    },
    infoAccordionTitle: {
      id: 'dpac.application:section.overview.labels.infoAccordionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Terms agreement label',
    },
    complaineeAccordionTitle: {
      id: 'dpac.application:section.overview.labels.complaineeAccordionTitle',
      defaultMessage: 'Yfir hverjum er kvartað',
      description: 'Terms agreement label',
    },
    complaintAccordionTitle: {
      id: 'dpac.application:section.overview.labels.complaintAccordionTitle',
      defaultMessage: 'Efni kvörtunar',
      description: 'Terms agreement label',
    },
  }),
}
