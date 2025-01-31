import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.tlwm.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    description: {
      id: 'aosh.tlwm.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview page',
    },
    pageTitle: {
      id: 'aosh.tlwm.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    approveButton: {
      id: 'aosh.tlwm.application:overview.general.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'Overview approveButton label',
    },
    agreeButton: {
      id: 'aosh.tlwm.application:overview.general.agreeButton',
      defaultMessage: 'Samþykkja',
      description: 'Overview agreeButton label',
    },
    rejectButton: {
      id: 'aosh.tlwm.application:overview.general.rejectButton',
      defaultMessage: 'Hafna',
      description: 'Overview rejectButton label',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.tlwm.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button on overview page',
    },
    applicant: {
      id: 'aosh.tlwm.application:overview.labels.applicant',
      defaultMessage: 'Umsækjandi (skráningaraðili)',
      description: 'Applicant label on overview page',
    },
    machineTenure: {
      id: 'aosh.tlwm.application:overview.labels.machineTenure',
      defaultMessage: 'Skráður starfstími á vinnuvél (Vottorð um starfstíma)',
      description: 'Machine tenure label on overview page',
    },
    assignee: {
      id: 'aosh.tlwm.application:overview.labels.assignee',
      defaultMessage: 'Staðfestingaraðili',
      description: 'Assignee label on overview page',
    },
  }),
}
