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
    descriptionAssignee: {
      id: 'aosh.tlwm.application:overview.general.descriptionAssignee',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en beiðnin er samþykkt.',
      description: 'Description for assignee of overview page',
    },
    pageTitle: {
      id: 'aosh.tlwm.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    pageTitleAssignee: {
      id: 'aosh.tlwm.application:overview.general.pageTitleAssignee',
      defaultMessage: 'Upplýsingar um skráningu',
      description: 'Title of overview section for assignee',
    },
    agreementText: {
      id: 'aosh.tlwm.application:overview.general.agreementText',
      defaultMessage:
        'Með því að senda inn umsóknina staðfestir þú að hafa stjórnað og sinnt viðhaldi á ofangreindri vél.',
      description: 'Agreement text on overview page',
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
    backButton: {
      id: 'aosh.tlwm.application:overview.general.backButton',
      defaultMessage: 'Til baka',
      description: 'Overview backButton label',
    },
    submitError: {
      id: 'aosh.tlwm.application:overview.general.submitError',
      defaultMessage:
        'Ekki tókst að senda skráningu. Vinsamlegast reynið aftur eða hafið samband við þjónustuver.',
      description: 'Overview submitError',
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
      defaultMessage: 'Umsækjandi',
      description: 'Applicant label on overview page',
    },
    machineTenure: {
      id: 'aosh.tlwm.application:overview.labels.machineTenure',
      defaultMessage: 'Starfstími á vinnuvél',
      description: 'Machine tenure label on overview page',
    },
    assignee: {
      id: 'aosh.tlwm.application:overview.labels.assignee',
      defaultMessage: 'Staðfestingaraðili {value}',
      description: 'Assignee label on overview page',
    },
  }),
  applicant: defineMessages({
    name: {
      id: 'aosh.tlwm.application:overview.labels.name',
      defaultMessage: 'Nafn: {value}',
      description: `Overview applicant name label`,
    },
    nationalId: {
      id: 'aosh.tlwm.application:overview.labels.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: `Overview applicant nationalId label`,
    },
    address: {
      id: 'aosh.tlwm.application:overview.labels.address',
      defaultMessage: 'Heimilisfang: {value}',
      description: `Overview applicant address label`,
    },
    postCode: {
      id: 'aosh.tlwm.application:overview.labels.postCode',
      defaultMessage: 'Bæjarfélag og póstnúmer: {value}',
      description: `Overview applicant post code label`,
    },
    phone: {
      id: 'aosh.tlwm.application:overview.labels.phone',
      defaultMessage: 'Símanúmer: {value}',
      description: `Overview applicant phone number label`,
    },
    email: {
      id: 'aosh.tlwm.application:overview.labels.email',
      defaultMessage: 'Netfang: {value}',
      description: `Overview applicant email label`,
    },
  }),
  assignee: defineMessages({
    companyName: {
      id: 'aosh.tlwm.application:overview.assignee.companyName',
      defaultMessage: 'Nafn fyrirtækis: {value}',
      description: `Overview assignee information name label`,
    },
    companyNationalId: {
      id: 'aosh.tlwm.application:overview.assignee.companyNationalId',
      defaultMessage: 'Kennitala fyrirtækis: {value}',
      description: `Overview assignee information national id label`,
    },
    assigneeName: {
      id: 'aosh.tlwm.application:overview.assignee.assigneeName',
      defaultMessage: 'Nafn tengiliðs: {value}',
      description: `Overview assignee information address label`,
    },
    assigneeNationalId: {
      id: 'aosh.tlwm.application:overview.assignee.assigneeNationalId',
      defaultMessage: 'Kennitala tengiliðs: {value}',
      description: `Overview assignee information post code label`,
    },
    assigneePhone: {
      id: 'aosh.tlwm.application:overview.assignee.assigneePhone',
      defaultMessage: 'Símanúmer tengiliðs: {value}',
      description: `Overview assignee information phone number label`,
    },
    assigneeEmail: {
      id: 'aosh.tlwm.application:overview.assignee.assigneeEmail',
      defaultMessage: 'Netfang tengiliðs: {value}',
      description: `Overview assignee information email label`,
    },
    workMachines: {
      id: 'aosh.tlwm.application:overview.assignee.workMachines',
      defaultMessage: 'Vinnuvél/ar: {value}',
      description: `Overview assignee information work machines label`,
    },
  }),
  certificateOfTenure: defineMessages({
    machineNumber: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.machineNumber',
      defaultMessage: 'Vinnuvélanúmer: {value}',
      description: 'Overview certificate of tenure machine number label',
    },
    machineType: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.machineType',
      defaultMessage: 'Tegund vélar: {value}',
      description: 'Overview certificate of tenure machine type label',
    },
    practicalRight: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.practicalRight',
      defaultMessage: 'Verkleg réttindi: {value}',
      description: 'Overview certificate of tenure practical right label',
    },
    tenureInHours: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.tenureInHours',
      defaultMessage: 'Starfstími í klst: {value}',
      description: 'Overview certificate of tenure in hours label',
    },
    period: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.period',
      defaultMessage: 'Tímabil: {value}',
      description: 'Overview certificate of tenure period',
    },
    contractor: {
      id: 'aosh.tlwm.application:overview.certificateOfTenure.contractor',
      defaultMessage: 'Sjálfstætt starfandi: Já',
      description: `Overview certificate of tenure contractor label`,
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'aosh.tlwm.application:overview.confirmationModal.title',
      defaultMessage: 'Hafna staðfestingu',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'aosh.tlwm.application:overview.confirmationModal.text',
      defaultMessage:
        'Þú ert að fara að hafna staðfestingu um starfstíma á vinnuvél.',
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'aosh.tlwm.application:overview.confirmationModal.buttonText',
      defaultMessage: 'Hafna',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'aosh.tlwm.application:overview.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
