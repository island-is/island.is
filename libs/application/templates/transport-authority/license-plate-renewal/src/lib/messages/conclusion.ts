import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.lpr.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ta.lpr.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion general alert title',
    },
    alertMessage: {
      id: 'ta.lpr.application:confirmation.general.alertMessage',
      defaultMessage:
        'Umsókn þín um endurnýjun á einkamerkis hefur verið móttekin',
      description: 'Conclusion general alert message',
    },
    accordionTitle: {
      id: 'ta.lpr.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionText: {
      id: 'ta.lpr.application:confirmation.general.accordionText',
      defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget congue nisi. Maecenas auctor nulla lorem, id eleifend ante dapibus vitae. `,
      description: 'Conclusion accordion text',
    },
  }),
}
