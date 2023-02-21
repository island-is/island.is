import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.dtdc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.dtdc.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.dtdc.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um ökuritakort hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.dtdc.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.dtdc.application:confirmation.general.accordionText',
      defaultMessage:
        `* Skírteinið verður sent annað hvort í pósti á skráð lögheimili eiganda eða til Samgöngustofu\n` +
        `* Ökuritakort má einungis afhenda til umsækjanda. Umsækjandi getur veitt öðrum heimild til að sækja kort og skal þá framvísa fullgildu umboði þess efnis\n` +
        `* Staðfesting/kvittun verður send í rafræn skjöl á island.is\n`,
      description: 'Confirmation accordion text',
    },
  }),
}
