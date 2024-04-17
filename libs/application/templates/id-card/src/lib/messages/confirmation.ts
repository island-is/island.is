import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'id.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín um nafnskírteini hefur verið móttekin',
      description: 'Confirmation alert title',
    },
    accordionTitle: {
      id: 'id.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'id.application:confirmation.general.accordionText',
      defaultMessage: `* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu nulla porta, luctus mi ac, pharetra mauris\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
