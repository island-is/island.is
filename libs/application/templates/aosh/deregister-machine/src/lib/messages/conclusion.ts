import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'aosh.drm.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'aosh.drm.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    approvedTitle: {
      id: 'aosh.drm.application:conclusion.general.approvedTitle',
      defaultMessage: 'Eigendaskipti samþykkt',
      description: 'Approved title of conclusion screen',
    },
    rejectedTitle: {
      id: 'aosh.drm.application:conclusion.general.rejectedTitle',
      defaultMessage: 'Umsókn afturkölluð',
      description: 'Rejected title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertMessage: {
      id: 'aosh.drm.application:conclusion.default.alertMessage',
      defaultMessage: 'Skráning móttekin!',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'aosh.drm.application:conclusion.default.accordionTitle',
      defaultMessage: 'Afskráning þín á tæki hefur verið móttekin!',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'aosh.drm.application:conclusion.default.accordionText',
      defaultMessage: `Nú hefur nýr umráðamaður verið skráður hjá Vinnueftirlitinu.`,
      description: 'Conclusion seller accordion text',
    },
    goToStatusButton: {
      id: 'aosh.drm.application:conclusion.default.goToStatusButton',
      defaultMessage: 'Skoða stöðu',
      description: 'Button on conclusion screen',
    },
    shareLink: {
      id: 'aosh.drm.application:conclusion.default.shareLink',
      defaultMessage: 'Hlekkur á umsóknina',
      description: 'Share link button on conclusion screen',
    },
    copyLink: {
      id: 'aosh.drm.application:conclusion.default.copyLink',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link label on conclusion screen',
    },
  }),
}
