import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovlp.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.ovlp.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation general alert title',
    },
    alertMessage: {
      id: 'ta.ovlp.application:confirmation.general.alertMessage',
      defaultMessage: 'Umsókn þín um skráningarmerki hefur verið móttekin',
      description: 'Confirmation general alert message',
    },
    accordionTitle: {
      id: 'ta.ovlp.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.ovlp.application:confirmation.general.accordionText',
      defaultMessage: `Framleiðsla skráningarmerkja tekur 3 virka daga. Þegar framleiðslu er lokið koma merkin til Samgöngustofu. Ef valið var að sækja merkin á skoðunarstöð eru merkin send þangað. Sendingartími fer eftir stöð.`,
      description: 'Confirmation accordion text',
    },
  }),
}
