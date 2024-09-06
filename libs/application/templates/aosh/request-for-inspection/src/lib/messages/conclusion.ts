import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'aosh.rifm.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'aosh.rifm.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    approvedTitle: {
      id: 'aosh.rifm.application:conclusion.general.approvedTitle',
      defaultMessage: 'Eigendaskipti samþykkt',
      description: 'Approved title of conclusion screen',
    },
    rejectedTitle: {
      id: 'aosh.rifm.application:conclusion.general.rejectedTitle',
      defaultMessage: 'Umsókn afturkölluð',
      description: 'Rejected title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertMessage: {
      id: 'aosh.rifm.application:conclusion.default.alertMessage',
      defaultMessage: 'Beiðni um skoðun á tæki hefur verið móttekin!',
      description: 'Conclusion seller alert message',
    },
    alertTitle: {
      id: 'aosh.rifm.application:conclusion.default.alertTitle',
      defaultMessage: 'Beiðni um skoðun á tæki hefur verið móttekin!',
      description: 'Conclusion seller alert title',
    },
    accordionTitle: {
      id: 'aosh.rifm.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'aosh.rifm.application:conclusion.default.accordionText',
      defaultMessage: `Nú hefur beiðni um skðun verið skráð hjá Vinnueftirlitinu.`,
      description: 'Conclusion seller accordion text',
    },
    goToStatusButton: {
      id: 'aosh.rifm.application:conclusion.default.goToStatusButton',
      defaultMessage: 'Skoða stöðu',
      description: 'Button on conclusion screen',
    },
    shareLink: {
      id: 'aosh.rifm.application:conclusion.default.shareLink',
      defaultMessage: 'Hlekkur á umsóknina',
      description: 'Share link button on conclusion screen',
    },
    copyLink: {
      id: 'aosh.rifm.application:conclusion.default.copyLink',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link label on conclusion screen',
    },
  }),
}
