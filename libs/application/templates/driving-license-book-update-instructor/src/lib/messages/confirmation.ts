import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    title: {
      id: 'dlui.application:confirmation.general.title',
      defaultMessage: 'Beiðni móttekin!',
      description: 'Title of confirmation screen',
    },
    sectionTitle: {
      id: 'dlui.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertMessageTitle: {
      id: 'dlui.application:confirmation.general.alertMessageTitle',
      defaultMessage:
        'Beiðni þín um breytingu á ökukennara hefur verið móttekin',
      description: 'Confirmation general alert message title',
    },
    openMySiteLinkText: {
      id: 'dlui.application:confirmation.general.openMySiteLinkText',
      defaultMessage: 'Mínar síður',
      description: 'Confirmation general open my site link text',
    },
  }),
}
