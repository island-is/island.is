import { defineMessages } from 'react-intl'

export const assigneeInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.tlwm.application:assigneeInformation.general.sectionTitle',
      defaultMessage: 'Staðfestingaraðili',
      description: `Section title for assignee information`,
    },
    title: {
      id: 'aosh.tlwm.application:assigneeInformation.general.title',
      defaultMessage: 'Staðfestingaraðili',
      description: 'Title for assignee information',
    },
    description: {
      id: 'aosh.tlwm.application:assigneeInformation.general.description',
      defaultMessage: 'Upplýsingar um samþykktaraðila.',
      description: 'Description for assignee information',
    },
  }),
  labels: defineMessages({
    companyName: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.name',
      defaultMessage: 'Nafn fyrirtækis',
      description: `Assignee information name label`,
    },
    companyNationalId: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.nationalId',
      defaultMessage: 'Kennitala fyrirtækis',
      description: `Assignee information nationalId label`,
    },
    assigneeName: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.address',
      defaultMessage: 'Nafn staðfestingaraðila',
      description: `Assignee information address label`,
    },
    assigneeNationalId: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.postCode',
      defaultMessage: 'Kennitala staðfestingaraðila',
      description: `Assignee information post code label`,
    },
    assigneePhone: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.phone',
      defaultMessage: 'Símanúmer staðfestingaraðila',
      description: `Assignee information phone number label`,
    },
    assigneeEmail: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.email',
      defaultMessage: 'Netfang staðfestingaraðila',
      description: `Assignee information email label`,
    },
    isContractor: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.isContractor',
      defaultMessage: 'Ég er verktaki',
      description: `Assignee information contractor label`,
    },
  }),
}
