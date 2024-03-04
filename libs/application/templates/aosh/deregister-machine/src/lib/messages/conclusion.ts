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
    expandableHeader: {
      id: 'aosh.drm.application:conclusion.default.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller expandable header',
    },
    expandableDescription: {
      id: 'aosh.drm.application:conclusion.default.expandableDescription',
      defaultMessage:
        'Afskráning þín á tæki hefur verið móttekin og skráð hjá Vinnueftirlitinu. Þú getur fylgst með stöðu umsóknarinnar í "Mínar síður".',
      description: 'Conclusion seller expandable description',
    },
  }),
}
