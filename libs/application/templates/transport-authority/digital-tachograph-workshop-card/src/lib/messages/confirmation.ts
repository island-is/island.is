import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtwc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.dtwc.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.dtwc.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um verkstæðiskort hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.dtwc.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.dtwc.application:confirmation.general.accordionText',
      defaultMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem tortor, dictum quis diam et, pharetra finibus sapien. Nullam pharetra ipsum quis dictum suscipit.',
      description: 'Confirmation accordion text',
    },
  }),
}
