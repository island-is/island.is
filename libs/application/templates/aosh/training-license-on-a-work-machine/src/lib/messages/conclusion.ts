import { defineMessages } from 'react-intl'

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
      defaultMessage:
        'Umsókn þín um kennsluréttindi á vinnuvél hefur verið send til samþykktar.',
      description: 'Conclusion applicant alert message',
    },
    expandableHeader: {
      id: 'aosh.tlwm.application:conclusion.default.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion applicant expandable header',
    },
    expandableDescription: {
      id: 'aosh.tlwm.application:conclusion.default.expandableDescription#markdown',
      defaultMessage: `* Nú þarf aðilinn sem á að samþykkja starfstíma á vinnuvél að klára það skref svo umsókn berist 
          Vinnueftirlitinu til yfirferðar. Þeir sem þurfa að samþykkja hafa 7 daga til þess.
          \n* Ef samþykki liggur ekki fyrir innan 7 daga verður umsóknin felld niður og umsækjandi upplýstur.`,
      description: 'Conclusion applicant expandable description',
    },
  }),
  approvedForApplicant: defineMessages({
    alertMessage: {
      id: 'aosh.tlwm.application:conclusion.approvedForApplicant.alertMessage',
      defaultMessage:
        'Umsókn þín um kennsluréttindi á vinnuvél hefur verið send til Vinnueftirlitsins.',
      description: 'Conclusion approved applicant alert message',
    },
    expandableHeader: {
      id: 'aosh.tlwm.application:conclusion.approvedForApplicant.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion approved applicant expandable header',
    },
    expandableDescription: {
      id: 'aosh.tlwm.application:conclusion.approvedForApplicant.expandableDescription#markdown',
      defaultMessage: `* Umsóknin hefur borist Vinnueftirlitinu til yfirferðar. 
            \n* Vinnueftirlitið upplýsir umsækjanda um framgang mála.`,
      description: 'Conclusion approved applicant expandable description',
    },
  }),
  approvedForAssignee: defineMessages({
    alertMessage: {
      id: 'aosh.tlwm.application:conclusion.approvedForAssignee.alertMessage',
      defaultMessage: 'Vottorð um starfstíma samþykkt!',
      description: 'Conclusion approved assignee alert message',
    },
    expandableHeader: {
      id: 'aosh.tlwm.application:conclusion.approvedForAssignee.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion approved assignee expandable header',
    },
    expandableDescription: {
      id: 'aosh.tlwm.application:conclusion.approvedForAssignee.expandableDescription#markdown',
      defaultMessage: `* Vinnueftirlitið upplýsir umsækjandann um niðurstöðuna.`,
      description: 'Conclusion approved assignee expandable description',
    },
  }),
  rejected: defineMessages({
    alertMessage: {
      id: 'aosh.tlwm.application:conclusion.rejected.alertMessage',
      defaultMessage: 'Samþykktaraðili hefur hafnað!',
      description: 'Conclusion rejected alert message',
    },
  }),
}
