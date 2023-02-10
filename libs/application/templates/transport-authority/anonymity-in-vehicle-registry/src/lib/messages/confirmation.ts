import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    title: {
      id: 'ta.avr.application:confirmation.general.title',
      defaultMessage: 'Beiðni móttekin!',
      description: 'Title of confirmation screen',
    },
    sectionTitle: {
      id: 'ta.avr.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertMessageTitle: {
      id: 'ta.avr.application:confirmation.general.alertMessageTitle',
      defaultMessage:
        'Beiðni þín um nafnleynd í ökutækjaskrá hefur verið móttekin',
      description: 'Confirmation general alert message title',
    },
    accordionTitle: {
      id: 'ta.avr.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.avr.application:confirmation.general.accordionText',
      defaultMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem tortor, dictum quis diam et, pharetra finibus sapien. Nullam pharetra ipsum quis dictum suscipit.',
      description: 'Confirmation accordion text',
    },
  }),
}
