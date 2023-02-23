import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtcc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.dtcc.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.dtcc.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um fyrirtækjakort hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.dtcc.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.dtcc.application:confirmation.general.accordionText',
      defaultMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem tortor, dictum quis diam et, pharetra finibus sapien. Nullam pharetra ipsum quis dictum suscipit.',
      description: 'Confirmation accordion text',
    },
  }),
}
