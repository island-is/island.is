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
    openMySiteLinkText: {
      id: 'ta.avr.application:confirmation.general.openMySiteLinkText',
      defaultMessage: 'Mínar síður',
      description: 'Confirmation general open my site link text',
    },
  }),
}
