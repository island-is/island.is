import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    title: {
      id: 'ta.ovrc.application:confirmation.general.title',
      defaultMessage: 'Pöntun móttekin!',
      description: 'Title of confirmation screen',
    },
    sectionTitle: {
      id: 'ta.ovrc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertMessageTitle: {
      id: 'ta.ovrc.application:confirmation.general.alertMessageTitle',
      defaultMessage:
        'Pöntun þín á skráningarskírteini fyrir {permno} hefur verið staðfest',
      description: 'Confirmation general alert message title',
    },
    alertMessageText: {
      id: 'ta.ovrc.application:confirmation.general.alertMessageText',
      defaultMessage:
        'Skírteinið verður sent í pósti á skráð lögheimili eiganda',
      description: 'Confirmation general alert message text',
    },
    openMySiteLinkText: {
      id: 'ta.ovrc.application:confirmation.general.openMySiteLinkText',
      defaultMessage: 'Mínar síður',
      description: 'Confirmation general open my site link text',
    },
  }),
}
