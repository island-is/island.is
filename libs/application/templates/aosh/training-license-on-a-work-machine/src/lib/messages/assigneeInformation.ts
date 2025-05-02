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
    tableButtonText: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.tableButtonText',
      defaultMessage: 'Skrá staðfestingaraðila',
      description: `Assignee information table button text`,
    },
    company: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.company',
      defaultMessage: 'Fyrirtæki',
      description: `Assignee information company label`,
    },
    companyName: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.companyName',
      defaultMessage: 'Nafn fyrirtækis',
      description: `Assignee information name label`,
    },
    companyNationalId: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.companyNationalId',
      defaultMessage: 'Kennitala fyrirtækis',
      description: `Assignee information nationalId label`,
    },
    assignee: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.assignee',
      defaultMessage: 'Staðfestingaraðili',
      description: `Assignee information assignee label`,
    },
    assigneeName: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.assigneeName',
      defaultMessage: 'Nafn staðfestingaraðila',
      description: `Assignee information address label`,
    },
    assigneeNationalId: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.assigneeNationalId',
      defaultMessage: 'Kennitala staðfestingaraðila',
      description: `Assignee information post code label`,
    },
    assigneePhone: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.assigneePhone',
      defaultMessage: 'Símanúmer staðfestingaraðila',
      description: `Assignee information phone number label`,
    },
    assigneeEmail: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.assigneeEmail',
      defaultMessage: 'Netfang staðfestingaraðila',
      description: `Assignee information email label`,
    },
    workMachine: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.workMachine',
      defaultMessage: 'Vinnuvél',
      description: `Assignee information work machine label`,
    },
    isContractor: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.isContractor',
      defaultMessage: 'Ég starfaði sjálfstætt á þessa vél',
      description: `Assignee information contractor label`,
    },
    isContractorAlert: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.isContractorAlert',
      defaultMessage:
        'Verktakar sem gera grein fyrir sínum eigin vinnutíma þurfa ekki að skrá staðfestingaraðila.',
      description: `Assignee information contractor alert`,
    },
    isSameAsApplicantAlert: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.isSameAsApplicantAlert',
      defaultMessage:
        'Staðfestingaraðili má ekki vera sá sami og umsækjandi. Ef að þú ert verktaki/sjálfstætt starfandi þá biðjum við þig um að haka í reitin hér fyrir ofan.',
      description: `Assignee information same as applicant alert`,
    },
    missingWorkMachineAlert: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.missingWorkMachineAlert',
      defaultMessage:
        'Það vantar að velja staðfestingaraðila fyrir eftirfarandi vinnuvélar: {value}',
      description: `Assignee information missing work machine alert`,
    },
    invalidWorkMachineAlert: {
      id: 'aosh.tlwm.application:assigneeInformation.labels.invalidWorkMachineAlert',
      defaultMessage:
        'Búið er að fjarlægja eftirfarandi vinnuvélar og þarf því að uppfæra upplýsingar: {value}',
      description: `Assignee information invalid work machine alert`,
    },
  }),
}
