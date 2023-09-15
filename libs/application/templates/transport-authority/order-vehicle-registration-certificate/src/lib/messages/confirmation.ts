import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovrc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.ovrc.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.ovrc.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um skráningarskírteini hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.ovrc.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.ovrc.application:confirmation.general.accordionText',
      defaultMessage:
        `* Skírteinið verður sent í pósti á skráð lögheimili eiganda\n` +
        `* Staðfesting/kvittun verður send í rafræn skjöl á island.is\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
