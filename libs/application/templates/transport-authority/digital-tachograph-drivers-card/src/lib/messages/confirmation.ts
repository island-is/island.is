import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    title: {
      id: 'ta.dtdc.application:confirmation.general.title',
      defaultMessage: 'Umsókn móttekin!',
      description: 'Title of confirmation screen',
    },
    sectionTitle: {
      id: 'ta.dtdc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertMessageTitle: {
      id: 'ta.dtdc.application:confirmation.general.alertMessageTitle',
      defaultMessage: 'Umsókn um ökuritakort hefur verið móttekin!',
      description: 'Confirmation general alert message title',
    },
    alertMessageText: {
      id: 'ta.dtdc.application:confirmation.general.alertMessageText',
      defaultMessage: 'Ökumannskortið verður sent á lögheimili yðar',
      description: 'Confirmation general alert message text',
    },
    accordionTitle: {
      id: 'ta.dtdc.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Confirmation accordion title',
    },
    accordionText: {
      id: 'ta.dtdc.application:confirmation.general.accordionText',
      defaultMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem tortor, dictum quis diam et, pharetra finibus sapien. Nullam pharetra ipsum quis dictum suscipit.',
      description: 'Confirmation accordion text',
    },
  }),
}
