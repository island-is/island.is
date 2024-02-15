import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'uni.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín um háskólavist hefur verið móttekin',
      description: 'Confirmation alert title',
    },
    accordionTitle: {
      id: 'uni.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'uni.application:confirmation.general.accordionText',
      defaultMessage: `* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu nulla porta, luctus mi ac, pharetra mauris\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
