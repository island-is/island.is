import { defineMessages } from 'react-intl'

export const freight = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:freight.general.sectionTitle',
      defaultMessage: 'Farmur',
      description: 'Title of freight section',
    },
  }),
  create: defineMessages({
    subSectionTitle: {
      id: 'ss.application:freight.create.subSectionTitle',
      defaultMessage: 'Skrá farm',
      description: 'Title of create freight sub section',
    },
    pageTitle: {
      id: 'ss.application:freight.create.pageTitle',
      defaultMessage: 'Farmur',
      description: 'Title of create freight page',
    },
  }),
  pairing: defineMessages({
    subSectionTitle: {
      id: 'ss.application:freight.pairing.subSectionTitle',
      defaultMessage: 'Para farm við vagnlest {freightName}',
      description: 'Title of pairing freight with convoy sub section',
    },
    pageTitle: {
      id: 'ss.application:freight.pairing.pageTitle',
      defaultMessage: 'Farmur {freightNumber}: {freightName}',
      description: 'Title of pairing freight with convoy page',
    },
  }),
}
