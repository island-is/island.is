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
    openMySiteLinkText: {
      id: 'ta.dtdc.application:confirmation.general.openMySiteLinkText',
      defaultMessage: 'Mínar síður',
      description: 'Confirmation general open my site link text',
    },
  }),
}
