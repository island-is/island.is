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
      defaultMessage: 'Styrkveiting hefur verið samþykkt!',
      description: 'Confirmation alert title',
    },
    accordionTitle: {
      id: 'ef.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ef.application:confirmation.general.accordionText',
      defaultMessage: `Styrkurinn verður lagður inn á reikning þinn innan tveggja daga.`,
      description: 'Confirmation accordion text',
    },
  }),
}
