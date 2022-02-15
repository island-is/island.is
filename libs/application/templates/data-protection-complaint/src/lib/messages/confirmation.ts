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
    description: {
      id: 'dpac.application:section.overview.labels.description',
      defaultMessage: `
      Upplýsingar um áætlaðan afgreiðslutíma kvartana má finna á {link}`,
      description: 'The first bullet',
    },
    linkName: {
      id: 'dpac.application:section.overview.labels.linkName',
      defaultMessage: `vefsíðu Persónuverndar`,
      description: 'Link name inside description',
    },
    link: {
      id: 'dpac.application:section.overview.labels.link',
      defaultMessage: `https://www.personuvernd.is/efst-a-baugi/malsmedferdartimi-hja-personuvernd`,
      description: 'Link inside description',
    },
    pdfLink: {
      id: 'dpac.application:section.overview.labels.pdfLink',
      defaultMessage: `Hlaða niður kvörtun á PDF`,
      description: 'Link inside description',
    },
  }),
}
