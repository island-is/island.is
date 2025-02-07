import { defineMessages } from 'react-intl'

// TODO: Change to be correct
export const conclusion = {
  general: defineMessages({
    title: {
      id: 'aosh.tlwm.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'aosh.tlwm.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertMessage: {
      id: 'aosh.tlwm.application:conclusion.default.alertMessage',
      defaultMessage: 'Skráning móttekin!',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'aosh.tlwm.application:conclusion.default.accordionTitle',
      defaultMessage: 'Nýskráning þín á tæki hefur verið móttekin!',
      description: 'Conclusion seller accordion title',
    },
    expandableHeader: {
      id: 'aosh.tlwm.application:conclusion.default.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller expandable header',
    },
    expandableDescription: {
      id: 'aosh.tlwm.application:conclusion.default.expandableDescription',
      defaultMessage:
        'Nýskráning þín á tæki hefur verið móttekin og skráð hjá Vinnueftirlitinu. Þú getur fylgst með stöðu umsóknarinnar í "Mínar síður".',
      description: 'Conclusion seller expandable description',
    },
  }),
  rejected: defineMessages({
    alertMessage: {
      id: 'aosh.tmo.application:conclusion.rejected.alertMessage',
      defaultMessage: 'Vottorð um starfstíma hafnað!',
      description: 'Conclusion rejected alert message',
    },
    message: {
      id: 'aosh.tmo.application:conclusion.rejected.message',
      defaultMessage: `Vinsamlegast hafið samband við Vinnueftirlitið, vinnueftirlit@ver.is, ef nánari upplýsinga er þörf.`,
      description: 'Conclusion rejected third text',
    },
  }),
}
