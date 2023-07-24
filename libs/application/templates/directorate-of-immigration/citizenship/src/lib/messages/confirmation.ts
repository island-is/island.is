import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'doi.cs.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation alert title',
    },
    alertMessage: {
      id: 'doi.cs.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um ríkisborgararétt hefur verið móttekin',
      description: 'Confirmation alert message',
    },
    accordionTitle: {
      id: 'doi.cs.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'doi.cs.application:confirmation.general.accordionText',
      defaultMessage: `* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu nulla porta, luctus mi ac, pharetra mauris\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
