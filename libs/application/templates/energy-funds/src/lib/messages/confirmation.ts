import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ef.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    alertTitle: {
      id: 'ef.application:confirmation.general.alertTitle',
      defaultMessage: '',
      description: 'Confirmation alert title',
    },
    alertMessage: {
      id: 'ef.application:confirmation.general.alertMessage',
      defaultMessage: 'Styrkveiting hefur verið samþykkt!',
      description: 'Confirmation alert message',
    },
    accordionTitle: {
      id: 'ef.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ef.application:confirmation.general.accordionText',
      defaultMessage: `* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu nulla porta, luctus mi ac, pharetra mauris\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
