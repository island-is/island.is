import { defineMessage, defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.overview.pageTitle',
      defaultMessage: 'Yfirlit kvörtunar',
      description: 'overview page title',
    },
  }),
  labels: defineMessage({
    alertTitle: {
      id: 'dpac.application:section.overview.labels.alertMessage',
      defaultMessage: `Umsókn þín hefur verið móttekin!`,
    },
    expandableHeader: {
      id: 'dpac.application:section.overview.labels.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Expandable header',
    },
    description: {
      id: 'dpac.application:section.overview.labels.description#markdown',
      defaultMessage: `Upplýsingar um áætlaðan afgreiðslutíma kvartana má finna á [vefsíðu Persónuverndar](https://www.personuvernd.is/efst-a-baugi/malsmedferdartimi-hja-personuvernd)`,
      description: 'Bulletpoints for conclusion screen',
    },
    pdfLink: {
      id: 'dpac.application:section.overview.labels.pdfLink',
      defaultMessage: `Sækja PDF`,
      description: 'Link inside description',
    },
  }),
}
