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
      defaultMessage: 'Pöntun þín á götuskráningu tækis hefur verið staðfest',
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
        'Framleiðsla skráningarmerkja tekur 3 virka daga. Þegar framleiðslu er lokið koma merkin til Samgöngustofu. Ef valið var að sækja merkin á skoðunarstöð eru merkin send þangað. Sendingartími fer eftir stöð.',
      description: 'Conclusion seller expandable description',
    },
  }),
}
